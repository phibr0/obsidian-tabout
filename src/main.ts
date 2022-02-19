import * as CodeMirror from "codemirror";
import { Editor, MarkdownView, Plugin } from "obsidian";
import { TaboutSettingsTab } from "./ui/settings";
import { TaboutSettings, DEFAULT_SETTINGS } from "./types";
import RuleCreateModal from "./ui/ruleCreateModal";
import { keymap } from "@codemirror/view";
import { EditorState, Extension, Prec } from "@codemirror/state";
import { syntaxTree } from "@codemirror/language";

export default class TaboutPlugin extends Plugin {
  settings: TaboutSettings;
  legacy: boolean;

  async onload() {
    await this.loadSettings();

    //@ts-expect-error `config` isn't available in the type defs
    this.legacy = this.app.vault.config.legacyEditor;
    if (this.legacy) {
      //Use the legacy tabout for CodeMirror 5
      this.registerCodeMirror((cm: CodeMirror.Editor) => {
        cm.on("beforeChange", this.legacyTabout);
      });
    } else {
      //Use a proper Editor Extension for CodeMirror 6
      this.registerEditorExtension(
        Prec.high(
          keymap.of([
            {
              key: "Tab",
              run: (eView) => this.tabout(this.getToken(eView.state)),
            },
          ])
        )
      );
    }

    this.addSettingTab(new TaboutSettingsTab(this.app, this));

    this.addCommand({
      id: "tabout-add-rule-here",
      name: "Add Rule for this Environment",
      editorCallback: (editor: Editor) => {
        let token = "";
        if (this.legacy) {
          //@ts-expect-error cm is not defined in the type docs
          token = editor.cm.getTokenTypeAt(editor.getCursor());
        } else {
          //@ts-expect-error cm is not defined in the type docs
          token = this.getToken(editor.cm.state);
        }
        new RuleCreateModal(
          this,
          token
        ).open();
      },
    });
  }

  getToken = (state: EditorState) => {
    const ast = syntaxTree(state);
    return ast.resolveInner(state.selection.main.head, -1).type
      .name as string;
  }

  tabout = (token: string): boolean => {
    for (let rule of this.settings.rules) {
      if (token.contains(rule.tokenMatcher)) {
        const editor =
          this.app.workspace.getActiveViewOfType(MarkdownView).editor;
        // Get Cursor Position
        const pos = editor.getCursor();
        // Get content of Line after Cursor
        const afterCursor = editor.getLine(pos.line).substring(pos.ch);
        // Determine the nearest character
        const nextChar = Math.min(
          ...this.getIndices(rule.lookups, afterCursor, rule.jumpAfter)
        );
        // If there is a nearest one jump right after it
        if (nextChar != Infinity) {
          editor.setCursor(pos.line, pos.ch + nextChar);
          return true;
        }
      }
    }
    return false;
  }

  legacyTabout = (cm: CodeMirror.Editor, changeObj: CodeMirror.EditorChange) => {
    if (changeObj.text.first() === "	") {
      const token = cm.getTokenTypeAt(cm.getCursor());
      //@ts-expect-error
      if (this.tabout(token)) changeObj.cancel();
    }
  };

  getIndices(rules: string[], afterCursor: string, jumpAfter: boolean) {
    let n: number[] = [];
    rules.forEach((r) => {
      let idx = afterCursor.indexOf(r);
      if (idx != -1) {
        n.push(jumpAfter ? idx + r.length : idx);
      }
    });
    return n;
  }

  onunload() {
    if (this.legacy) {
      this.app.workspace.iterateCodeMirrors((cm) =>
        cm.off("beforeChange", this.legacyTabout)
      );
    }
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}

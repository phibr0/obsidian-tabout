import * as CodeMirror from 'codemirror';
import { Plugin } from 'obsidian';
import { MathSettingsTab } from './settings';

interface MathPluginSettings {
}

const DEFAULT_SETTINGS: MathPluginSettings = {
}

export default class MathPlugin extends Plugin {
	settings: MathPluginSettings;
	handlingMath: boolean;

	handleCursorChange = (cm: CodeMirror.Editor) => {
		if (cm.getTokenTypeAt(cm.getCursor())?.match(/math/)) {
			if (!this.handlingMath) {
				cm.on('beforeChange', this.handleMathChange);
				this.handlingMath = true;
			}
		} else {
			cm.off("beforeChange", this.handleMathChange);
			this.handlingMath = false;
		}
	}

	handleMathChange = (cm: CodeMirror.Editor, changeObj: CodeMirror.EditorChange) => {
		if (changeObj.text.first() === "**" || changeObj.text.first() === "*") {
			//@ts-ignore
			changeObj.cancel();
			const pos = cm.getCursor();
			cm.replaceRange("\\times", pos);
			cm.setCursor({
				ch: pos.ch + 7,
				line: pos.line,
			});
		}
		if (changeObj.text.first() === "	") {
			console.log("success")
			//@ts-ignore
			changeObj.cancel();
			const pos: CodeMirror.Position = cm.getCursor();
			const afterCursor: string = cm.getLine(pos.line).substring(pos.ch);
			const rules: number[] = [
				afterCursor.indexOf("{"),
				afterCursor.indexOf("(")
			];
			rules.forEach(element => element === -1 && rules.remove(element));
			const nextChar: number = Math.min(...rules);
			console.log({pos, afterCursor, rules, nextChar});
			if(nextChar != -1) {
				cm.setCursor(pos.line, pos.ch + nextChar + 1);
			}
		}
	}

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new MathSettingsTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			cm.on("cursorActivity", this.handleCursorChange);
			if (this.handlingMath) {
				cm.off("beforeChange", this.handleMathChange);
			}
		});
	}

	onunload() {
		this.app.workspace.iterateCodeMirrors(cm => cm.off("cursorActivity", this.handleCursorChange));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

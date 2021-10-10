import * as CodeMirror from 'codemirror';
import { Plugin } from 'obsidian';
import { TaboutSettingsTab } from './ui/settings';
import { TaboutSettings, DEFAULT_SETTINGS } from './types';

export default class TaboutPlugin extends Plugin {
	settings: TaboutSettings;
	handlingMath: boolean;

	async onload() {
		await this.loadSettings();

		this.addSettingTab(new TaboutSettingsTab(this.app, this));

		this.registerCodeMirror((cm: CodeMirror.Editor) => {
			cm.on("beforeChange", this.handleTabs);
		});
	}

	handleTabs = (cm: CodeMirror.Editor, changeObj: CodeMirror.EditorChange) => {
		// If tab is pressed
		if (changeObj.text.first() === "	") {
			for (let rule of this.settings.rules) {
				// If Cursor is in correct environment
				if (cm.getTokenTypeAt(cm.getCursor())?.match(RegExp(rule.tokenMatcher))) {
					// Get Cursor Position
					const pos = cm.getCursor();
					// Get content of Line after Cursor
					const afterCursor = cm.getLine(pos.line).substring(pos.ch);
					// Determine the nearest character
					const nextChar = Math.min(...this.getIndices(rule.lookups, afterCursor, rule.jumpAfter));
					// If there is a nearest one jump right after it
					if (nextChar != Infinity) {
						// @ts-ignore Don't insert the Tab
						changeObj.cancel();
						cm.setCursor(pos.line, pos.ch + nextChar);
					}
				}
			}
		}
	};

	getIndices(rules: string[], afterCursor: string, jumpAfter: boolean) {
		let n: number[] = [];
		rules.forEach(r => {
			let idx = afterCursor.indexOf(r);
			if (idx != -1) {
				n.push(jumpAfter ? idx + r.length : idx);
			}
		});
		return n;
	}

	onunload() {
		this.app.workspace.iterateCodeMirrors(cm => cm.off("beforeChange", this.handleTabs));
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

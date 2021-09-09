import { PluginSettingTab, App, Setting } from "obsidian";
import MathPlugin from "./main";

export class MathSettingsTab extends PluginSettingTab {
	plugin: MathPlugin;

	constructor(app: App, plugin: MathPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		let {containerEl} = this;

		containerEl.empty();

		containerEl.createEl('h2', {text: 'Better Math Settings'});

	}
}

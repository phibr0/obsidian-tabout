import { Modal, Setting } from "obsidian";
import TaboutPlugin from "../main";
import { Rule } from "../types";

export default class RuleEditModal extends Modal {
	plugin: TaboutPlugin;
	rule: Rule;
	idx: number;

	constructor(plugin: TaboutPlugin, rule: Rule, idx: number) {
		super(plugin.app);
		this.plugin = plugin;
		this.rule = rule;
		this.idx = idx;
	}

	onOpen() {
		let { contentEl } = this;
		contentEl.empty();

		new Setting(contentEl)
			.setName("Environment")
			.setClass("tabout-match-text")
			.setDesc("The Codemirror Token for the Environment.")
			.addText(text => {
				text
					.setValue(this.rule.tokenMatcher)
					.setPlaceholder("em")
					.onChange(value => {
						this.rule.tokenMatcher = value;
					});
			});


		new Setting(contentEl)
			.setName("Jump after the Characters")
			.setClass("tabout-match-text")
			.setDesc("If enabled the Cursor will be set after the Characters, otherwise before them.")
			.addToggle(toggle => {
				toggle
					.setValue(this.rule.jumpAfter)
					.onChange(value => {
						this.rule.jumpAfter = value;
					});
			});

		this.rule.lookups.forEach((jumpChar, idx) => {
			new Setting(contentEl)
				.setName(idx === 0 ? "Characters" : "")
				.setClass("tabout-jump-char")
				.addExtraButton(btn => {
					btn
						.setIcon("trash")
						.onClick(() => {
							this.rule.lookups.remove(this.rule.lookups[idx]);
							this.onOpen();
						});
				})
				.addText(text => {
					text
						.setValue(jumpChar)
						.setPlaceholder("**")
						.onChange(value => {
							this.rule.lookups[idx] = value;
						});
				});
		});

		new Setting(contentEl)
			.setClass("tabout-jump-char")
			.addButton(bt => {
				bt.setButtonText("Add Character")
					.onClick(() => {
						this.rule.lookups.push("");
						this.onOpen();
					});
			});

		const btn = createEl("button", { text: "Save Rule", cls: "tabout-add-rule" });
		btn.onClickEvent(() => {
			this.close();
		});
		contentEl.createDiv({ cls: "tabout-add-rule-container" }).append(btn);
	}

	onClose() {
		let { contentEl } = this;
		contentEl.empty();
		dispatchEvent(new CustomEvent("tabout-edit-complete", { detail: { rule: this.rule, idx: this.idx } }));
	}
}
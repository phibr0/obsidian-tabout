import { Modal, Notice, Setting } from "obsidian";
import TaboutPlugin from "../main";
import { Rule } from "../types";

export default class RuleCreateModal extends Modal {
    plugin: TaboutPlugin;
    rule: Rule;

    constructor(plugin: TaboutPlugin) {
        super(plugin.app);
        this.plugin = plugin;
        this.rule = {
            lookups: [""],
            tokenMatcher: "",
            jumpAfter: true,
        };
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

        const saveBtn = createEl("button", { text: "Add this Rule", cls: "tabout-add-rule" });
        saveBtn.onClickEvent(() => {
            if (this.rule.tokenMatcher && this.rule.lookups.length >= 1 && this.rule.lookups.first()) {
                this.save();
                this.close();
            } else {
                new Notice("Something is still Missing");
            }
        });
        const cancelBtn = createEl("button", { text: "Cancel", cls: "tabout-add-rule" });
        cancelBtn.onClickEvent(() => {
            this.close();
        });
        contentEl.createDiv({ cls: "tabout-add-rule-container" }).append(saveBtn, cancelBtn);
    }

    onClose() {
        let { contentEl } = this;
        contentEl.empty();
    }

    save() {
        dispatchEvent(new CustomEvent("tabout-rule-create", { detail: { rule: this.rule } }));
    }
}
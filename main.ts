import { App, Plugin, PluginSettingTab, Setting } from "obsidian";

// ------------------------------------------------------------------------------------
// Core
// ------------------------------------------------------------------------------------

interface FullWidthSettings {
	isToggled: boolean;
	width: number;
}

const DEFAULT_SETTINGS: FullWidthSettings = {
	isToggled: false,
	width: 95,
};

export default class FullWidth extends Plugin {
	settings: FullWidthSettings;

	async onload() {
		await this.loadSettings();

		this.addRibbonIcon(
			"unfold-horizontal",
			"Full Width",
			(evt: MouseEvent) => {
				toggleFullWidth(this.settings);
			}
		);

		this.addSettingTab(new FullWidthSettingTab(this.app, this));
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

// ------------------------------------------------------------------------------------
// Settings
// ------------------------------------------------------------------------------------

class FullWidthSettingTab extends PluginSettingTab {
	plugin: FullWidth;

	constructor(app: App, plugin: FullWidth) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("Width")
			.setDesc(
				"Customize the width to make the editor/viewer when toggled."
			)
			.addText((text) =>
				text
					.setPlaceholder("Width (as a %)")
					.setValue(this.plugin.settings.width.toString())
					.onChange(async (value) => {
						if (!value) return;
						const valueNumber = parseFloat(value);
						if (
							isNaN(valueNumber) ||
							valueNumber < 0 ||
							valueNumber > 1000
						)
							return;

						this.plugin.settings.width = valueNumber;
						await this.plugin.saveSettings();
					})
			);
	}
}

// ------------------------------------------------------------------------------------
// Full Width
// ------------------------------------------------------------------------------------

const STYLE_ID = "style-full-width";

function hasInjected() {
	return !!document.getElementById(STYLE_ID);
}

async function injectFullWidth(settings: FullWidthSettings) {
	if (hasInjected()) return;

	const styleElement = document.createElement("style");
	styleElement.id = STYLE_ID;
	styleElement.innerHTML = `
		.markdown-preview-view.is-readable-line-width .markdown-preview-sizer,
		.markdown-source-view.is-readable-line-width:not(.is-rtl) .cm-contentContainer,
		.markdown-source-view.is-line-wrap.is-readable-line-width .cm-content,
		.markdown-source-view.is-readable-line-width .CodeMirror,
		.markdown-preview-view.is-readable-line-width .markdown-preview-sizer,
		.markdown-source-view.mod-cm6.is-readable-line-width .cm-sizer {
			max-width: ${settings.width}% !important;
		}
	`;
	document.querySelector("head")?.appendChild(styleElement);

	this.settings.isToggled = true;
	await this.saveSettings();
}

async function removeFullWidth(settings: FullWidthSettings) {
	document.getElementById(STYLE_ID)?.remove();
	this.settings.isToggled = false;
	await this.saveSettings();
}

async function toggleFullWidth(settings: FullWidthSettings) {
	if (hasInjected()) {
		await removeFullWidth(settings);
	} else {
		await injectFullWidth(settings);
	}
}

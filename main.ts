import { App, Plugin, PluginSettingTab, setIcon, Setting } from "obsidian";

interface FullWidthSettings {
	isToggled: boolean;
	width: number;
}

const DEFAULT_SETTINGS: FullWidthSettings = {
	isToggled: false,
	width: 95,
};

export default class FullWidth extends Plugin {
	// ------------------------------------------
	// Core
	// ------------------------------------------

	STYLE_ID = "style-full-width";
	ICON_ACTIVE = "chevrons-right-left";
	ICON_OFF = "chevrons-left-right";

	settings: FullWidthSettings;
	$ribbonIcon: HTMLElement;

	async onload() {
		await this.loadSettings();

		this.$ribbonIcon = this.addRibbonIcon(this.ICON_OFF, "Full Width", () =>
			this.toggleFullWidth()
		);

		if (this.settings.isToggled) {
			await this.injectFullWidth();
		}

		this.addSettingTab(new FullWidthSettingTab(this.app, this));
	}

	onunload() {
		this.removeFullWidth();
	}

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

	// ------------------------------------------
	// Full Width
	// ------------------------------------------

	hasInjected() {
		return !!document.getElementById(this.STYLE_ID);
	}

	async injectFullWidth() {
		if (this.hasInjected()) return;

		const styleElement = document.createElement("style");
		styleElement.id = this.STYLE_ID;
		styleElement.innerHTML = `
		.markdown-preview-view.is-readable-line-width .markdown-preview-sizer,
		.markdown-source-view.is-readable-line-width:not(.is-rtl) .cm-contentContainer,
		.markdown-source-view.is-line-wrap.is-readable-line-width .cm-content,
		.markdown-source-view.is-readable-line-width .CodeMirror,
		.markdown-preview-view.is-readable-line-width .markdown-preview-sizer,
		.markdown-source-view.mod-cm6.is-readable-line-width .cm-sizer {
			max-width: ${this.settings.width}% !important;
		}
	`;
		document.querySelector("head")?.appendChild(styleElement);

		this.settings.isToggled = true;
		this.setRibbonIcon();
		await this.saveSettings();
	}

	async removeFullWidth() {
		document.getElementById(this.STYLE_ID)?.remove();
		this.settings.isToggled = false;
		this.setRibbonIcon();
		await this.saveSettings();
	}

	async toggleFullWidth() {
		if (this.hasInjected()) {
			await this.removeFullWidth();
		} else {
			await this.injectFullWidth();
		}
	}

	async setRibbonIcon() {
		if (this.settings.isToggled) {
			setIcon(this.$ribbonIcon, this.ICON_ACTIVE);
		} else {
			setIcon(this.$ribbonIcon, this.ICON_OFF);
		}
	}
}

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

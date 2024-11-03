# [Obsidian Plugin] Full Width

Simple plugin to make the viewer/editor the full width of the screen.

## Install

### Copy-Paste build from Releases

1. [Download latest release here](https://github.com/hmerritt/obsidian-plugin-full-width/releases/download/1.25.0/full-width.tar)
2. Untar `full-width.tar`
3. Move full-width folder to `<obsidian-vault>/.obsidian/plugins/full-width`

### Build manially

1. Clone repo `git clone https://github.com/hmerritt/obsidian-plugin-full-width.git`
2. `cd obsidian-plugin-full-width`
3. `npm i`
4. `npm run build`
5. Copy `main.js` + `manifest.json` into your `<obsidian-vault>/.obsidian/plugins/full-width`

## Developing

-   Clone repo
-   Make sure your NodeJS is at least v16 (`node --version`)
-   `npm i` to install dependencies.
-   `npm run dev` to start compilation in watch mode.
-   `npm run build` to compile

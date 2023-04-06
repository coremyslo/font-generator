# @coremyslo/font-generator [![npm](https://img.shields.io/npm/v/@coremyslo/font-generator)](https://www.npmjs.com/package/@coremyslo/font-generator) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg?style=flat-square)](https://github.com/coremyslo/font-generator/blob/main/LICENSE)
A font generator library that takes a collection of icons and generates a custom font in different formats (SVG, TTF, WOFF, WOFF2, EOT).

Input should be based on [icon-generator](https://github.com/coremyslo/icon-generator).
## Installation

```shell
npm install @coremyslo/font-generator
```

## Usage
```typescript
import { FontGenerator } from "@coremyslo/font-generator";
import { IconGenerator } from "@coremyslo/icon-generator";

const iconGenerator = new IconGenerator(process.cwd(), "./path/to/icon/source/directory");
await iconGenerator.read();

const fontGenerator = new FontGenerator();
await fontGenerator.generate(iconGenerator.icons);
await fontGenerator.write(path.join(process.cwd(), "./path/to/target/directory"));
```

## API
### `class FontGenerator (options: Partial<Options> = {})`
### interface Options
* name: The name of the font and the generated font files. Default `icon-font`.
* unicode: The starting Unicode code point for the icon set. Default `0xE900`.
* height: The height of the generated font. Default `1024`.
* normalize: Normalize icons by scaling them to the height of the highest icon (see [svgicons2svgfont](https://www.npmjs.com/package/svgicons2svgfont)). Default `true`.
* round: Setup SVG path rounding. (see [svgicons2svgfont](https://www.npmjs.com/package/svgicons2svgfont)) Default `1`.
* formats: An array of supported font formats. Default `["svg", "ttf", "woff", "woff2", "eot"]`.

### `async generate(icons: Map<string, Icon>): Promise<void>`
* Generate the font files in memory for the specified icon collection. Caches the result, so calling again with the same icons retrieves the fonts from the cache.
### `async write(targetDirPath: string): Promise<void>`
* Write the generated font files to the specified directory.
### `fonts: Map<string, Buffer>`
* contains the generated font files in memory.

import type { FontFormat } from "./types";
import SVGIcons2SVGFontStream from "svgicons2svgfont";
import svg2ttf from "svg2ttf";
import ttf2eot from "ttf2eot";
import ttf2woff from "ttf2woff";
import ttf2woff2 from "ttf2woff2";
import type { Icon } from "@coremyslo/svg-to-icon";
import { v5 as uuidv5 } from "uuid";
import { promises as fsp } from "node:fs";

export interface Options {
    name: string;
    unicode: string;
    height: number;
    normalize: boolean;
    round: number;
    formats: FontFormat[];
}
export interface Font {
    uuid: string;
    value: Uint8Array;
}
export class FontGenerator {
    public static readonly uuid = "3ca97b56-a2f4-4530-92f4-5e0219bc63a7";

    public readonly options: Options = {
        name: "icon-font",
        unicode: "0xE900",
        height: 1024,
        normalize: true,
        round: 1,
        formats: ["svg", "ttf", "woff", "woff2", "eot"],
    };

    public fonts = new Map<FontFormat, Font>();

    public constructor (options: Partial<Options> = {}) {
        this.options = { ...this.options, ...options };
    }

    static #getParentFontFormat (format: FontFormat): FontFormat | "" {
        if (format === "svg") {
            return "";
        }
        if (format === "ttf") {
            return "svg";
        }

        return "ttf";
    }

    static #getIconsUuid (icons: Map<string, Icon>) {
        return uuidv5(JSON.stringify(Array.from(icons.entries())), FontGenerator.uuid);
    }

    public async write (targetDirPath: string): Promise<void> {
        try {
            await fsp.access(targetDirPath);
        } catch (e) {
            await fsp.mkdir(targetDirPath, { recursive: true });
        }
        for await (const format of this.options.formats) {
            const font = this.fonts.get(format);
            if (font) {
                await fsp.writeFile(`${targetDirPath}/${this.options.name}.${format}`, font.value);
            }
        }
    }

    public async generate (icons: Map<string, Icon>): Promise<void> {
        for await (const format of this.options.formats) {
            await this.#generate(icons, format);
        }
    }

    async #generate (icons: Map<string, Icon>, format: FontFormat, uuid = ""): Promise<void> {
        uuid ||= FontGenerator.#getIconsUuid(icons);

        const cacheExists = this.fonts.get(format)?.uuid === uuid;
        if (cacheExists) {
            return;
        }

        const getFontValue = async (): Promise<Uint8Array> => {
            const parentFontFormat = FontGenerator.#getParentFontFormat(format);
            if (parentFontFormat) {
                await this.#generate(icons, parentFontFormat, uuid);
                const fontValue = this.fonts.get(parentFontFormat)?.value;
                if (format === "ttf") {
                    return svg2ttf(fontValue?.toString() || "").buffer;
                } else if (format === "woff") {
                    return ttf2woff(fontValue || new Uint8Array());
                } else if (format === "woff2") {
                    return ttf2woff2(Buffer.from(fontValue || new Uint8Array()));
                }

                return ttf2eot(fontValue || new Uint8Array());
            }

            return await this.#icons2svg(icons);
        };

        this.fonts.set(format, { uuid, value: await getFontValue() });
    }

    #icons2svg (icons: Map<string, Icon>): Promise<Uint8Array> {
        return new Promise<Uint8Array>(resolve => {
            const chunks: Uint8Array[] = [];
            const { height: fontHeight, name: fontName, normalize, round } = this.options;
            const fontReadStream = new SVGIcons2SVGFontStream({
                fontName,
                fontHeight,
                normalize,
                round,
                log (): void { },
            }).on("data", (chunk: Uint8Array) => {
                chunks.push(chunk);
            }).on("error", (e: Error) => {
                throw e;
            }).on("end", () => {
                resolve(Buffer.concat(chunks));
            });
            [...icons].forEach(([, icon], index) => {
                const glyph = icon.getGlyph({
                    metadata: {
                        name: icon.name,
                        unicode: [String.fromCharCode(parseInt(this.options.unicode, 16) + index)],
                    },
                });
                fontReadStream.write(glyph);
            });
            fontReadStream.end();
        });
    }
}

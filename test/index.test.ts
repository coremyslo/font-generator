import { IconGenerator } from "@coremyslo/icon-generator";
import { FontGenerator } from "../src";
import path from "node:path";
import { promises as fsp } from "fs";

const svgFontFileContent = `<?xml version="1.0" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd" >
<svg xmlns="http://www.w3.org/2000/svg">
<defs>
  <font id="icon-font" horiz-adv-x="1024">
    <font-face font-family="icon-font"
      units-per-em="1024" ascent="1024"
      descent="0" />
    <missing-glyph horiz-adv-x="0" />
    <glyph glyph-name="icon-bug"
      unicode="&#xE900;"
      horiz-adv-x="1024" d="M228 341C228 184 355 57 512 57S796 184 796 341V512H228V341zM680 848L765 934L732 967L638 873C600 893 558 904 512 904S424 893 386 873L292 967L259 934L345 848A281 281 0 0 1 228 620V569H796V620C796 714 750 796 680 848zM398 683H341V740H398V683zM683 683H626V740H683V683z" />
  </font>
</defs>
</svg>
`;

const sourceDirPath = path.join(process.cwd(), "node_modules/@coremyslo/icon-generator/test/assets/new");
const uuid = "5870443c-877d-5b12-babd-9d2b6ad93e5d";

const iconGenerator = new IconGenerator(sourceDirPath);

test("init", async () => {
    await iconGenerator.read();
});

test("generate svg", async () => {
    const fontGenerator = new FontGenerator({
        formats: ["svg"],
    });
    await fontGenerator.generate(iconGenerator.icons);
    expect(fontGenerator.fonts.get("svg")?.uuid).toBe(uuid);
    expect(fontGenerator.fonts.get("svg")?.value.toString()).toBe(svgFontFileContent);
    expect(fontGenerator.fonts.get("ttf")).toBeUndefined();
    expect(fontGenerator.fonts.get("woff")).toBeUndefined();
    expect(fontGenerator.fonts.get("woff2")).toBeUndefined();
    expect(fontGenerator.fonts.get("eot")).toBeUndefined();
});
test("generate ttf", async () => {
    const fontGenerator = new FontGenerator({
        formats: ["ttf"],
    });
    await fontGenerator.generate(iconGenerator.icons);
    expect(fontGenerator.fonts.get("svg")?.uuid).toBe(uuid);
    expect(fontGenerator.fonts.get("svg")?.value.toString()).toBe(svgFontFileContent);
    expect(fontGenerator.fonts.get("ttf")?.uuid).toBe(uuid);
    expect(typeof fontGenerator.fonts.get("ttf")).toBe("object");
    expect(fontGenerator.fonts.get("woff")).toBeUndefined();
    expect(fontGenerator.fonts.get("woff2")).toBeUndefined();
    expect(fontGenerator.fonts.get("eot")).toBeUndefined();
});
test("generate woff", async () => {
    const fontGenerator = new FontGenerator({
        formats: ["woff"],
    });
    await fontGenerator.generate(iconGenerator.icons);
    expect(fontGenerator.fonts.get("svg")?.uuid).toBe(uuid);
    expect(fontGenerator.fonts.get("svg")?.value.toString()).toBe(svgFontFileContent);
    expect(fontGenerator.fonts.get("ttf")?.uuid).toBe(uuid);
    expect(typeof fontGenerator.fonts.get("ttf")).toBe("object");
    expect(fontGenerator.fonts.get("woff")?.uuid).toBe(uuid);
    expect(typeof fontGenerator.fonts.get("woff")).toBe("object");
    expect(fontGenerator.fonts.get("woff2")).toBeUndefined();
    expect(fontGenerator.fonts.get("eot")).toBeUndefined();
});
test("generate woff2", async () => {
    const fontGenerator = new FontGenerator({
        formats: ["woff2"],
    });
    await fontGenerator.generate(iconGenerator.icons);
    expect(fontGenerator.fonts.get("svg")?.uuid).toBe(uuid);
    expect(fontGenerator.fonts.get("svg")?.value.toString()).toBe(svgFontFileContent);
    expect(fontGenerator.fonts.get("ttf")?.uuid).toBe(uuid);
    expect(typeof fontGenerator.fonts.get("ttf")).toBe("object");
    expect(fontGenerator.fonts.get("woff")).toBeUndefined();
    expect(fontGenerator.fonts.get("woff2")?.uuid).toBe(uuid);
    expect(typeof fontGenerator.fonts.get("woff2")).toBe("object");
    expect(fontGenerator.fonts.get("eot")).toBeUndefined();
});

test("generate eot", async () => {
    const fontGenerator = new FontGenerator({
        formats: ["eot"],
    });
    await fontGenerator.generate(iconGenerator.icons);
    expect(fontGenerator.fonts.get("svg")?.uuid).toBe(uuid);
    expect(fontGenerator.fonts.get("svg")?.value.toString()).toBe(svgFontFileContent);
    expect(fontGenerator.fonts.get("ttf")?.uuid).toBe(uuid);
    expect(typeof fontGenerator.fonts.get("ttf")).toBe("object");
    expect(fontGenerator.fonts.get("woff")).toBeUndefined();
    expect(fontGenerator.fonts.get("woff2")).toBeUndefined();
    expect(fontGenerator.fonts.get("eot")?.uuid).toBe(uuid);
    expect(typeof fontGenerator.fonts.get("eot")).toBe("object");
});
test("generate all", async () => {
    const fontGenerator = new FontGenerator();
    await fontGenerator.generate(iconGenerator.icons);
    expect(fontGenerator.fonts.get("svg")?.uuid).toBe(uuid);
    expect(fontGenerator.fonts.get("svg")?.value.toString()).toBe(svgFontFileContent);
    expect(fontGenerator.fonts.get("ttf")?.uuid).toBe(uuid);
    expect(typeof fontGenerator.fonts.get("ttf")).toBe("object");
    expect(fontGenerator.fonts.get("woff")?.uuid).toBe(uuid);
    expect(typeof fontGenerator.fonts.get("woff")).toBe("object");
    expect(fontGenerator.fonts.get("woff2")?.uuid).toBe(uuid);
    expect(typeof fontGenerator.fonts.get("woff2")).toBe("object");
    expect(fontGenerator.fonts.get("eot")?.uuid).toBe(uuid);
    expect(typeof fontGenerator.fonts.get("eot")).toBe("object");
});
test("write", async () => {
    const folder = "./test/fonts/new";
    const fontGenerator = new FontGenerator({
        formats: ["woff2"],
    });
    await fontGenerator.generate(iconGenerator.icons);
    await fontGenerator.write(folder);

    await expect(fsp.access(`${folder}/${fontGenerator.options.name}.svg`)).rejects.toThrow(`ENOENT: no such file or directory, access '${`${folder}/${fontGenerator.options.name}.svg`}'`);
    await expect(fsp.access(`${folder}/${fontGenerator.options.name}.ttf`)).rejects.toThrow(`ENOENT: no such file or directory, access '${`${folder}/${fontGenerator.options.name}.ttf`}'`);
    await expect(fsp.access(`${folder}/${fontGenerator.options.name}.woff`)).rejects.toThrow(`ENOENT: no such file or directory, access '${`${folder}/${fontGenerator.options.name}.woff`}'`);
    await expect(fsp.access(`${folder}/${fontGenerator.options.name}.woff2`)).resolves.toBeUndefined();
    await expect(fsp.access(`${folder}/${fontGenerator.options.name}.eot`)).rejects.toThrow(`ENOENT: no such file or directory, access '${`${folder}/${fontGenerator.options.name}.eot`}'`);
});

test("formats remove duplicates and sort", () => {
    const fontGenerator = new FontGenerator({
        formats: ["ttf", "eot", "woff2", "woff", "woff2"],
    });
    expect(fontGenerator.options.formats).toEqual(["woff2", "woff", "ttf", "eot"]);
});

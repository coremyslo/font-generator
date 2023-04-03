"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _FontGenerator_instances, _a, _FontGenerator_getParentFontFormat, _FontGenerator_getIconsUuid, _FontGenerator_icons2svg;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FontGenerator = void 0;
const svgicons2svgfont_1 = __importDefault(require("svgicons2svgfont"));
const svg2ttf_1 = __importDefault(require("svg2ttf"));
const ttf2eot_1 = __importDefault(require("ttf2eot"));
const ttf2woff_1 = __importDefault(require("ttf2woff"));
const ttf2woff2_1 = __importDefault(require("ttf2woff2"));
const uuid_1 = require("uuid");
class FontGenerator {
    constructor(options = {}) {
        _FontGenerator_instances.add(this);
        this.options = {
            name: "iconFont",
            case: "kebab",
            unicode: "0xE900",
            height: 1024,
            normalize: true,
            round: 1,
        };
        this.fonts = new Map();
        this.options = Object.assign(Object.assign({}, this.options), options);
    }
    generate(format, icons, uuid = "") {
        var _b;
        return __awaiter(this, void 0, void 0, function* () {
            uuid || (uuid = __classPrivateFieldGet(FontGenerator, _a, "m", _FontGenerator_getIconsUuid).call(FontGenerator, icons));
            const cacheExists = ((_b = this.fonts.get(format)) === null || _b === void 0 ? void 0 : _b.uuid) === uuid;
            if (cacheExists) {
                return;
            }
            const getFontValue = () => __awaiter(this, void 0, void 0, function* () {
                var _c;
                const parentFontFormat = __classPrivateFieldGet(FontGenerator, _a, "m", _FontGenerator_getParentFontFormat).call(FontGenerator, format);
                if (parentFontFormat) {
                    yield this.generate(parentFontFormat, icons, uuid);
                    const fontValue = (_c = this.fonts.get(parentFontFormat)) === null || _c === void 0 ? void 0 : _c.value;
                    if (format === "ttf") {
                        return (0, svg2ttf_1.default)((fontValue === null || fontValue === void 0 ? void 0 : fontValue.toString()) || "").buffer;
                    }
                    else if (format === "woff") {
                        return (0, ttf2woff_1.default)(fontValue || new Uint8Array());
                    }
                    else if (format === "woff2") {
                        return (0, ttf2woff2_1.default)(Buffer.from(fontValue || new Uint8Array()));
                    }
                    return (0, ttf2eot_1.default)(fontValue || new Uint8Array());
                }
                return yield __classPrivateFieldGet(this, _FontGenerator_instances, "m", _FontGenerator_icons2svg).call(this, icons);
            });
            this.fonts.set(format, { uuid, value: yield getFontValue() });
        });
    }
}
exports.FontGenerator = FontGenerator;
_a = FontGenerator, _FontGenerator_instances = new WeakSet(), _FontGenerator_getParentFontFormat = function _FontGenerator_getParentFontFormat(format) {
    if (format === "svg") {
        return "";
    }
    if (format === "ttf") {
        return "svg";
    }
    return "ttf";
}, _FontGenerator_getIconsUuid = function _FontGenerator_getIconsUuid(icons) {
    return (0, uuid_1.v5)(JSON.stringify(Array.from(icons.entries())), FontGenerator.uuid);
}, _FontGenerator_icons2svg = function _FontGenerator_icons2svg(icons) {
    return new Promise(resolve => {
        const chunks = [];
        const { height: fontHeight, name: fontName, normalize, round } = this.options;
        const fontReadStream = new svgicons2svgfont_1.default({
            fontName,
            fontHeight,
            normalize,
            round,
            log() { },
        }).on("data", (chunk) => {
            chunks.push(chunk);
        }).on("error", (e) => {
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
};
FontGenerator.uuid = "3ca97b56-a2f4-4530-92f4-5e0219bc63a7";

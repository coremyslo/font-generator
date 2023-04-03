import type { Case, FontFormat } from "./types";
import type { Icon } from "@coremyslo/svg-to-icon";
export interface Options {
    name: string;
    case: Case;
    unicode: string;
    height: number;
    normalize: boolean;
    round: number;
}
export interface Font {
    uuid: string;
    value: Uint8Array;
}
export declare class FontGenerator {
    #private;
    static readonly uuid = "3ca97b56-a2f4-4530-92f4-5e0219bc63a7";
    readonly options: Options;
    fonts: Map<FontFormat, Font>;
    constructor(options?: Partial<Options>);
    generate(format: FontFormat, icons: Map<string, Icon>, uuid?: string): Promise<void>;
}

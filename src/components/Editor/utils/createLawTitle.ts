import { MetaType } from "../Slate"
import convertRomanNumber from "./convertRomanNumber"

const createLawTitle = (nr: string, type: MetaType) => {
    switch (type) {
        case MetaType.CHAPTER:
            return `${convertRomanNumber(nr)}.`
        case MetaType.ART:
            return `${nr}. gr.`
        case MetaType.SUBART:
        case MetaType.PARAGRAPH:
        default:
            return ``
    }
}

export default createLawTitle;
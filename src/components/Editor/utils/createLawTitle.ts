import convertRomanNumber from "../../../utils/convertRomanNumber"
import { MetaType } from "../Slate"

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
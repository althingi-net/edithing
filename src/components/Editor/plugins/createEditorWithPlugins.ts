import { withLists } from "@prezly/slate-lists";
import { createEditor } from "slate";
import { withHistory } from "slate-history";
import { withReact } from "slate-react";
import { schema } from "../Slate";
import withLawParagraphs from "./withLawParagraphs";
import withEvents from "./withEvents";

const createEditorWithPlugins = () => withLawParagraphs(
    withEvents(
        // withLists(schema)(
            withHistory(
                withReact(createEditor())
            )
        // )
    )
);

export default createEditorWithPlugins;
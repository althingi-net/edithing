import { useEffect, useState } from "react";
import { Editor, Operation } from "slate";
import getParagraphId from "./getParagraphId";

export interface Event {
    id: string;
    type: Operation['type'];
}

const useEvents = (editor: Editor) => {
    const [events, setEvents] = useState<Event[]>([]);
    
    useEffect(() => {
        const { apply } = editor;

        editor.apply = (operation) => {

            if (!operation || operation?.type === 'set_selection') {
                return apply(operation);
            }

            const id = getParagraphId(editor, operation.path);

            setEvents((events) => {
                // ignore events that are not the lowest child
                // if (events.find(event => event.id.includes(id) && event.type === operation.type)) {
                //     return events;
                // }

                return [...events, { id, type: operation.type}]
            });

            apply(operation);
        }
    }, [editor]);

    return events;
}

export default useEvents;

// const setupEditor = (document: any[]) => {
//     const editor = createEditorWithPlugins(); 
//     editor.children = document;

//     const originalDocument = document;

//     return { editor, originalDocument };
// };

test.skip('export added', () => {

    // const { editor, originalDocument } = setupEditor([
    //     createList(MetaType.CHAPTER, {}, [
    //         createListItem(MetaType.CHAPTER, '1', { title: '1. Chapter' }, [
    //             createList(MetaType.ART, {}, [
    //                 createListItem(MetaType.ART, '1', { text: 'some text' }),
    //             ]),
    //         ]),
    //     ]),
    // ]);

    // Transforms.insertText(editor, 'sd', { at: { path: [0, 0, 0, 0], offset: 10 } });

    // const bill: Bill = {
    //     title: 'Title',
    // };
    // const billDocuments: BillDocument[] = [{
    //     originalXml: JSON.stringify([]),
    //     content: JSON.stringify([]),
    //     events: JSON.stringify([]),
    //     identifier: 'Chapter-1',
    //     title: 'Chapter 1',
    // }];

    // const changelog: Changelog[] = [{
    //     type: 'added',
    //     id: 'Chapter-1.Art-2',
    //     text: 'New Paragraph',
    // }];

    // expect(exportBillXml(changelog)).toBe(xmlFormat(`
    //     <changes>
    //         <art nr="1">
    //             <subart nr="1">
    //                 <sen nr="1" change-type="added" origin-id="Chapter-1.Art-2">
    //                     New Paragraph
    //                 </sen>
    //             </subart>
    //         </art>
    //     </changes>
    // `));
});

test.skip('export removed', () => {
    // const changelog: Changelog[] = [{
    //     type: 'deleted',
    //     id: 'Chapter-1.Art-2',
    //     text: 'New Paragraph',
    // }];

    // expect(exportBillXml(changelog)).toBe(xmlFormat(`
    //     <changes>
    //         <art nr="1">
    //             <subart nr="1">
    //                 <sen nr="1" change-type="deleted" origin-id="Chapter-1.Art-2">
    //                     New Paragraph
    //                 </sen>
    //             </subart>
    //         </art>
    //     </changes>
    // `));
});

test.skip('export changed', () => {
    // const changelog: Changelog[] = [{
    //     type: 'changed',
    //     id: 'Chapter-1.Art-2',
    //     text: 'New Paragraph',
    // }];

    // expect(exportBillXml(changelog)).toBe(xmlFormat(`
    //     <changes>
    //         <art nr="1">
    //             <subart nr="1">
    //                 <sen nr="1" change-type="changed" origin-id="Chapter-1.Art-2">
    //                     New Paragraph
    //                 </sen>
    //             </subart>
    //         </art>
    //     </changes>
    // `));
});
    
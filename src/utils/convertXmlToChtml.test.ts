import convertXmlToChtml from "./convertXmlToChtml";

test('<paragraph> to <p>', () => {
    const input = `<paragraph>html</paragraph>`;
    const output = `<p>html</p>`;

    expect(convertXmlToChtml(input)).toBe(output);
});

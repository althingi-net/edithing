import convertXmlToChtml from "./convertXmlToChtml";

test('<law> to <ol type="I">', () => {
    const input = `<law><name>Stjórnarskrá lýðveldisins Íslands</name></law>`;
    const output = `<ol type="I"></ol>`;

    expect(convertXmlToChtml(input)).toBe(output);
});

test('<chapter> to <li><ol>', () => {
    const input = `<chapter nr="1" nr-type="roman" roman-nr="I"><nr-title>I.</nr-title></chapter>`;
    const output = `<li><ol></ol></li>`;

    expect(convertXmlToChtml(input)).toBe(output);
});

test('<law><chapter><chapter></law> to <ol><li/><li/></ol>', () => {
    const input = `
        <law>
            <chapter nr="1" nr-type="roman" roman-nr="I"><nr-title>I.</nr-title></chapter>
            <chapter nr="1" nr-type="roman" roman-nr="II"><nr-title>II.</nr-title></chapter>
        </law>
    `;
    const output = `<ol type="I"><li><ol></ol></li><li><ol></ol></li></ol>`;

    expect(convertXmlToChtml(input)).toBe(output);
});

test('<art> to <li><ol>', () => {
    const input = `<art nr="1"><nr-title>1</nr-title></art>`;
    const output = `<li><ol></ol></li>`;

    expect(convertXmlToChtml(input)).toBe(output);
});

test('<law><art><art></law> to <ol><li/><li/></ol>', () => {
    const input = `
        <law>
            <art nr="1"><nr-title>I.</nr-title></art>
            <art nr="1"><nr-title>II.</nr-title></art>
        </law>
    `;
    const output = `<ol type="I"><li><ol></ol></li><li><ol></ol></li></ol>`;

    expect(convertXmlToChtml(input)).toBe(output);
});

test('<subart> to <li><ol>', () => {
    const input = `<subart nr="1"><nr-title>1</nr-title></subart>`;
    const output = `<li><ol></ol></li>`;

    expect(convertXmlToChtml(input)).toBe(output);
});

test('<law><subart><subart></law> to <ol><li/><li/></ol>', () => {
    const input = `
        <law>
            <subart nr="1"><nr-title>I.</nr-title></subart>
            <subart nr="1"><nr-title>II.</nr-title></subart>
        </law>
    `;
    const output = `<ol type="I"><li><ol></ol></li><li><ol></ol></li></ol>`;

    expect(convertXmlToChtml(input)).toBe(output);
});

test('<paragraph> to <p>', () => {
    const input = `<paragraph nr="1"><nr-title>1</nr-title></paragraph>`;
    const output = `<p></p>`;

    expect(convertXmlToChtml(input)).toBe(output);
});

test('<law><paragraph><paragraph></law> to <ol><li/><li/></ol>', () => {
    const input = `
        <law>
            <paragraph nr="1"><nr-title>I.</nr-title></paragraph>
            <paragraph nr="1"><nr-title>II.</nr-title></paragraph>
        </law>
    `;
    const output = `<ol type="I"><p></p><p></p></ol>`;

    expect(convertXmlToChtml(input)).toBe(output);
});

test('<sen> to <p>', () => {
    const input = `<sen>dgs</sen>`;
    const output = `<span>dgs</span>`;

    expect(convertXmlToChtml(input)).toBe(output);
});

test('<law><sen><sen></law> to <ol><span/><span/></ol>', () => {
    const input = `
        <law>
            <sen>1</sen>
            <sen>2</sen>
        </law>
    `;
    const output = `<ol type="I"><span>1</span><span>2</span></ol>`;

    expect(convertXmlToChtml(input)).toBe(output);
});


test('<law> to retain nr', () => {
    const input = `<law nr="33" year="1944"></law>`;
    const output = `<ol type="I" data-nr="33" data-year="1944"></ol>`;

    expect(convertXmlToChtml(input)).toBe(output);
});
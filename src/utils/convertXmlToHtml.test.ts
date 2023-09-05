import convertXmlToHtml from "./convertXmlToHtml";

test('<law> to <div class="boxbody">', () => {
    const input = `
        <?xml version="1.0" encoding="utf-8"?>
        <law nr="33" year="1944">
        </law>
    `;
    const output = '<div class="boxbody"></div>';

    expect(convertXmlToHtml(input)).toBe(output);
});

test('<name> to <h2>', () => {
    const input = `<name>Stjórnarskrá lýðveldisins Íslands</name>`;
    const output = '<h2>Stjórnarskrá lýðveldisins Íslands</h2>';

    expect(convertXmlToHtml(input)).toBe(output);
});

test('<date> to void', () => {
    const input = `<date>1944-06-17</date>`;
    const output = '';

    expect(convertXmlToHtml(input)).toBe(output);
});

test('<num> to void', () => {
    const input = `<num>1944-06-17</num>`;
    const output = '';

    expect(convertXmlToHtml(input)).toBe(output);
});

test('<original> to <p> + <hr>', () => {
    const input = `<original>1944 nr. 33 17. júní</original>`;
    const output = `<p style="text-align:center"><strong>1944 nr. 33 17. júní</strong></p><hr>`;

    expect(convertXmlToHtml(input)).toBe(output);
});

test('<minister-clause> to custom formatting', () => {
    const input = `<minister-clause>html</minister-clause>`;
    const output = `html<hr><br>`;

    expect(convertXmlToHtml(input)).toBe(output);
});

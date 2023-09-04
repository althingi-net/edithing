import convertXmlToHtml from "./convertXmlToHtml";

// test('full document', () => {
//     const input = `
//         <?xml version="1.0" encoding="utf-8"?>
//         <law nr="33" year="1944">
//         <name>Stjórnarskrá lýðveldisins Íslands</name>
//         <num-and-date>
//             <date>1944-06-17</date>
//             <num>33</num>
//             <original>1944 nr. 33 17. júní</original>
//         </num-and-date>
//         <minister-clause>&lt;a href=&quot;http://www.althingi.is//dba-bin/ferill.pl?ltg=63&amp;amp;mnr=1&quot;&gt; &lt;i&gt; Ferill málsins á Alþingi. &lt;/i&gt; &lt;/a&gt; &lt;a href=&quot;http://www.althingi.is/altext/63/s/pdf/0001.pdf&quot;&gt; &lt;i&gt; Frumvarp til laga. &lt;/i&gt; &lt;/a&gt; &lt;br/&gt; &lt;br/&gt; &lt;small&gt; &lt;b&gt; Tók gildi 17. júní 1944. &lt;/b&gt; &lt;em&gt; Breytt með: &lt;/em&gt; &lt;a href=&quot;/altext/stjtnr.html#1959051&quot;&gt; L. 51/1959 &lt;/a&gt; (tóku gildi 20. ágúst 1959). &lt;a href=&quot;/altext/stjtnr.html#1968009&quot;&gt; L. 9/1968 &lt;/a&gt; (tóku gildi 24. apríl 1968). &lt;a href=&quot;/altext/stjtnr.html#1984065&quot;&gt; L. 65/1984 &lt;/a&gt; (tóku gildi 13. júní 1984). &lt;a href=&quot;/altext/stjt/1991.056.html&quot;&gt; L. 56/1991 &lt;/a&gt; (tóku gildi 31. maí 1991). &lt;a href=&quot;/altext/stjt/1995.097.html&quot;&gt; L. 97/1995 &lt;/a&gt; (tóku gildi 5. júlí 1995). &lt;a href=&quot;/altext/stjt/1995.100.html&quot;&gt; L. 100/1995 &lt;/a&gt; (tóku gildi 5. júlí 1995). &lt;a href=&quot;/altext/stjt/1999.077.html&quot;&gt; L. 77/1999 &lt;/a&gt; (tóku gildi 1. júlí 1999). &lt;a href=&quot;/altext/stjt/2013.091.html&quot;&gt; L. 91/2013 &lt;/a&gt; (tóku gildi 18. júlí 2013). &lt;br/&gt; &lt;/small&gt;</minister-clause>
//         <chapter nr="1" nr-type="roman" roman-nr="I">
//             <nr-title>I.</nr-title>
//             <art nr="1">
//                 <nr-title>1. gr.</nr-title>
//                 <subart nr="1">
//                 <paragraph nr="1">
//                     <sen>Ísland er lýðveldi með þingbundinni stjórn.</sen>
//                 </paragraph>
//                 </subart>
//             </art>
//             <art nr="2">
//                 <nr-title>2. gr.</nr-title>
//                 <subart nr="1">
//                 <paragraph nr="1">
//                     <sen>Alþingi og forseti Íslands fara saman með löggjafarvaldið.</sen>
//                     <sen>Forseti og önnur stjórnarvöld samkvæmt stjórnarskrá þessari og öðrum landslögum fara með framkvæmdarvaldið.</sen>
//                     <sen>Dómendur fara með dómsvaldið.</sen>
//                 </paragraph>
//                 </subart>
//             </art>
//         </chapter>
//         </law>
//     `;

//     const output = `
//         <div class="boxbody">
//         <h2> Stjórnarskrá lýðveldisins Íslands </h2>
//         <p style="text-align:center"><strong>1944 nr. 33 17. júní</strong></p>
//         <hr>
//         <a href="https://www.althingi.is/thingstorf/thingmalalistar-eftir-thingum/ferill/?ltg=63&amp;mnr=1"><i>Ferill
//                 málsins á Alþingi.</i></a>&nbsp;&nbsp;&nbsp;
//         <a href="https://www.althingi.is/altext/pdf/63/s/0001.pdf"><i>Frumvarp til laga.</i></a>
//         <br>
//         <br>
//         <small><b>Tók gildi 17. júní 1944.</b> <em>Breytt með: </em> <a href="/altext/stjtnr.html#1959051">L. 51/1959</a>
//             (tóku gildi 20. ágúst 1959). <a href="/altext/stjtnr.html#1968009">L. 9/1968</a> (tóku gildi 24. apríl 1968). <a
//                 href="/altext/stjtnr.html#1984065">L. 65/1984</a> (tóku gildi 13. júní 1984). <a
//                 href="/altext/stjt/1991.056.html">L. 56/1991</a> (tóku gildi 31. maí 1991). <a
//                 href="/altext/stjt/1995.097.html">L. 97/1995</a> (tóku gildi 5. júlí 1995). <a
//                 href="/altext/stjt/1995.100.html">L. 100/1995</a> (tóku gildi 5. júlí 1995). <a
//                 href="/altext/stjt/1999.077.html">L. 77/1999</a> (tóku gildi 1. júlí 1999). <a
//                 href="/altext/stjt/2013.091.html">L. 91/2013</a> (tóku gildi 18. júlí 2013). <br></small>
//         <hr>
//         <br>
//         <b>I.</b>
//         <br>
//         <span id="G1"></span>
//         <img src="/lagas/sk.jpg" width="11" alt="">
//         <b>1. gr.</b>
//         <br>
//         <img src="/lagas/hk.jpg" width="11" alt="" id="G1M1"> Ísland er lýðveldi með þingbundinni stjórn.
//         <br>
//         <span id="G2"></span>
//         <img src="/lagas/sk.jpg" width="11" alt="">
//         <b>2. gr.</b>
//         <br>
//         <img src="/lagas/hk.jpg" width="11" alt="" id="G2M1"> Alþingi og forseti Íslands fara saman með löggjafarvaldið.
//         Forseti og önnur stjórnarvöld samkvæmt stjórnarskrá þessari og öðrum landslögum fara með framkvæmdarvaldið. Dómendur
//         fara með dómsvaldið.
//         <br>
//         <br>
//     `;

//     expect(convertXmlToHtml(input)).toBe(output);
// });

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

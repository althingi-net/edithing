export const LANGUAGES = ['en', 'is'];

/** Default language is english, all keys in translations are english therefore */
export const DEFAULT_LANGUAGE = 'en';

const translations: { [key: string]: { [key: string]: string } } = {
    is: {
        'Edit': 'Breyta',
        'Back': 'Til baka',
        'Filter': 'Sía',
        'Loading...': 'Hleð...',
        'Not found!': 'Fannst ekki!',
        'Legal Codex': 'Lagasafn',
        'Element Configuration': 'Stillingar færslu',
        'Old XML': 'Eldra XML',
        'New XML': 'Nýtt XML',
        'Changes': 'Breytingar',
        'of the law shall be': 'lögum skal',
        'of the law was removed.': 'lögum var fjarlægt.',
        'of the law was added': 'lögum var bætt við',
        'Type': 'Tegund',
        'Title': 'Titill',
        'Has title?': 'Hefur titil?',
        'Name': 'Nafn',
        'Has name?': 'Hefur nafn?',
        'Nr.': 'Númer',
        'Roman Nr.': 'Rómverskt númer',
        'chapter': 'kafla',
        'art': 'gr.',
        'subart': 'mgr.',
        'numart': 'tölul./stafl.',
        'sen': 'málsl.',
        'Highlight elements': 'Litamerkja færslur',
        'No changes': 'Engar breytingar',
        'Only display differences': 'Birta einungis mismun',
        'Show full text': 'Sýna allan texta',
        'Or': 'Eða',
        'as a nested child': 'sem undirfærsla',
        'A new entry will be inserted as sibling of': 'Ný færsla verður sett inn við hliðina á',
        'Increase following chapters nr attribute and title?': 'Uppfæra númer og nöfn færslna sem koma á eftir',
        'Cancel': 'Hætta við',
        'Add': 'Bæta við',
        'Add new Entry': 'Bæta við nýrri færslu',
        'Create a title for this paragraph. Needs to be first text of paragraph': 'Búðu til titil fyrir þessa málsgrein. Þarf að vera fyrsti texti málsgreinar',
        'Create a name for this paragraph. Needs to be first text of paragraph if there is no title or be right after the title': 'Búðu til nafn fyrir þessa málsgrein. Þarf að vera fyrsti texti málsgreinar ef það er enginn titill eða vera rétt á eftir titlinum',
        'Format the selected text as its own sentence.': 'Gera valinn texta að málslið.',
        'Format selected text with': 'Gera valinn texta:',
        'Press again to remove formatting.': 'Ýttu aftur til að fjarlægja snið.',
        'Copy content to clipboard': 'Afrita efni í klippiborð',
    },
};

export default translations;
export const LANGUAGES = ['en', 'is'];

/** Default language is english, so by default developers work with english and everything gets translated from english into other languages */
export const DEFAULT_LANGUAGE = 'en';

const translations: { [key: string]: { [key: string]: string } } = {
    is: {
        'Edit': 'Breyta',
        'Back': 'Til baka',
        'Loading...': 'Hleð...',
        'Not found!': 'Ekki fundið!',
        'Law Entries': 'Lögfræðifærslur',
        'Paragraph Configuration': 'Málsgrein Stilling',
        'Old XML': 'Gammalt XML',
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
        'Nr.': 'Nr.',
        'Roman Nr.': 'Rómverskur Nr.',
        'chapter': 'kafla',
        'art': 'gr',
        'subart': 'mgr',
        'numart': 'mgr',
        'sen': 'málsl',
        'Highlight sentences': 'Leggðu áherslu á setningar',
        'No changes': 'Engar breytingar',
        'Only display differences': 'Aðeins birta mismun',
        'Show full text': 'Sýna allan texta',
        'Or': 'Eða',
        'as a nested child': 'sem undirbarn',
        'A new entry will be inserted as sibling of': 'Ný færsla verður sett inn sem systkini af',
        'Increase following chapters nr attribute and title?': 'Auka eftirfarandi kafla nr eiginleika og titil?',
        'Cancel': 'Hætta við',
        'Add': 'Bæta við',
        'Add new Entry': 'Bæta við nýrri færslu',
        'Create a title for this paragraph. Needs to be first text of paragraph': 'Búðu til titil fyrir þessa málsgrein. Þarf að vera fyrsti texti málsgreinar',
        'Create a name for this paragraph. Needs to be first text of paragraph if there is no title or be right after the title': 'Búðu til nafn fyrir þessa málsgrein. Þarf að vera fyrsti texti málsgreinar ef það er enginn titill eða vera rétt á eftir titlinum',
        'Format the selected text as its own sentence.': 'Forsníða valda texta sem sína eigin setningu.',
        'Format selected text with': 'Forsniðið valinn texta með',
        'Press again to remove formatting.': 'Ýttu aftur til að fjarlægja snið.',
        'Copy content to clipboard': 'Afrita efni í klippiborð',
    },
};

export default translations;
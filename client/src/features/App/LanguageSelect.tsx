import { Radio } from 'antd';
import { ReactCountryFlag } from 'react-country-flag';
import useLanguageContext from './useLanguageContext';

const LanguageSelect = () => {
    const { language, setLanguage } = useLanguageContext();

    return (
        <Radio.Group value={language} onChange={(event) => setLanguage(event.target.value as string)}>
            <Radio.Button value="en"><ReactCountryFlag countryCode="GB" /></Radio.Button>
            <Radio.Button value="is"><ReactCountryFlag countryCode="IS" /></Radio.Button>
        </Radio.Group>
    );
};

export default LanguageSelect;
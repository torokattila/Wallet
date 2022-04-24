import { enUS, huHU } from '@mui/material/locale';
import moment from 'moment';
import { useTranslation } from 'react-i18next';

const LANGS = [
    {
        label: 'English',
        value: 'en',
        systemValue: enUS,
        icon: '/static/ic_flag_en.svg',
    },
    {
        label: 'Magyar',
        value: 'hu',
        systemValue: huHU,
        icon: '/static/ic_flag_hu.svg',
    },
];

const useLocales = () => {
    const { i18n, t: translate } = useTranslation('translations');
    const langStorage = localStorage.getItem('i18nextLng');
    const currentLang =
        LANGS.find((_lang) => _lang.value === langStorage) || LANGS[1];

    const handleChangeLanguage = (newLang: string) => {
        i18n.changeLanguage(newLang);
        moment.locale(newLang);
    };

    return {
        onChangeLang: handleChangeLanguage,
        translate,
        currentLang,
        allLang: LANGS,
    };
};

export default useLocales;

import countries from "i18n-iso-countries";
import enLocale from "i18n-iso-countries/langs/en.json";
countries.registerLocale(enLocale);

export function codeToCountry(code: string) {
    return countries.getName(code, "en");
};
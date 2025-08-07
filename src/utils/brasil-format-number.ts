export const formatBrNumber = (value: number, locale = "pt-BR") => {
    return new Intl.NumberFormat(locale, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
};

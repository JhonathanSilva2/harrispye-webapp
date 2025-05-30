export const isValidDate = (date: unknown) =>
    date instanceof Date && !isNaN(date.getTime());

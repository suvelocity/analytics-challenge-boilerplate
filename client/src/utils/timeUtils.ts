export const todayMs: () => number = () => new Date().getTime();

export const nowString: () => string = () => new Date().toISOString().slice(0, 10);

export const oneDayMs: number = 1000 * 24 * 60 * 60;

export const oneWeekMs: number = oneDayMs * 7;

/**
 * Converts a UTC date to local datetime-local format
 * @param date UTC Date object
 * @returns Formatted string in datetime-local format (YYYY-MM-DDTHH:mm)
 */
export const formatToLocalDateTime = (date: Date): string => {
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
};

/**
 * Gets the date 24 hours ago from now
 * @returns Date object representing 24 hours ago
 */
export const get24HoursAgo = (): Date => {
    const now = new Date();
    return new Date(now.getTime() - 24 * 60 * 60 * 1000);
};

/**
 * Converts a local datetime string to UTC Date
 * @param localDateTime Local datetime string in format YYYY-MM-DDTHH:mm
 * @returns UTC Date object
 */
export const localDateTimeToUTC = (localDateTime: string): Date => {
    return new Date(localDateTime + 'Z');
};

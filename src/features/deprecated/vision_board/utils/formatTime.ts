/**
 * Adjusts the timestamp by adding 8 hours (for timezone) and formats it to a readable string
 * @param timeString ISO timestamp string
 * @returns Formatted time string (YYYY-MM-DD HH:mm:ss)
 */
export const formatTimestamp = (timeString: string): string => {
    const date = new Date(timeString);
    date.setHours(date.getHours() + 8);
    return date.toISOString().replace('T', ' ').slice(0, 19);
};

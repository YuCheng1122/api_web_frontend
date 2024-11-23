/**
 * Formats the agent status string by removing the last 7 characters and appending the value
 * @param word The original status string
 * @param value The value to append
 * @returns Formatted string
 */
export const formatAgentStatus = (word: string, value: number): string => {
    const trimmedWord = word.slice(0, -7); // Remove "的 Agent" suffix
    return `${trimmedWord} ${value}`;
};

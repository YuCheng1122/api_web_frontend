/**
 * Normalizes an array of numbers using a compression factor.
 * The normalization process includes:
 * 1. Standard min-max normalization
 * 2. Applying a compression factor to reduce extreme values
 * 3. Scaling back to the original range
 * 4. Rounding to integers
 * 
 * @param data Array of numbers to normalize
 * @param compressionFactor Compression factor (default: 0.5)
 * @returns Normalized array of integers
 */
export const normalizeData = (data: number[], compressionFactor: number = 0.5): number[] => {
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;
  
    if (range === 0) return data;
  
    return data.map(value => {
        // Normalize to [0,1] range
        const normalizedValue = (value - min) / range;
        // Apply compression and scale back
        const calculatedValue = min + (normalizedValue ** compressionFactor) * range;
        // Round to integer
        return Math.round(calculatedValue);
    });
};

import { useState } from 'react';
import { NDRData } from '../types/ndr';

export const useNDR = () => {
    // NDR specific state and logic will be implemented here
    const [data, setData] = useState<NDRData | null>(null);

    // NDR specific methods will be added here

    return {
        data,
    };
};

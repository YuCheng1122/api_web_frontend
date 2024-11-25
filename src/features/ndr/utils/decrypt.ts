// Decryption utility using Web Crypto API
const SALT_LENGTH = 16;
const IV_LENGTH = 12;
const KEY_LENGTH = 256;
const ITERATIONS = 100000;

async function getKeyMaterial(password: string): Promise<CryptoKey> {
    const encoder = new TextEncoder();
    return await window.crypto.subtle.importKey(
        "raw",
        encoder.encode(password),
        { name: "PBKDF2" },
        false,
        ["deriveBits", "deriveKey"]
    );
}

async function deriveKey(keyMaterial: CryptoKey, salt: Uint8Array): Promise<CryptoKey> {
    return await window.crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: salt,
            iterations: ITERATIONS,
            hash: "SHA-256"
        },
        keyMaterial,
        { name: "AES-GCM", length: KEY_LENGTH },
        false,
        ["decrypt"]
    );
}

export async function decrypt(encryptedData: string, key: string): Promise<string> {
    try {
        // Convert from base64
        const binaryString = atob(encryptedData);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }

        // Extract salt, IV, and ciphertext
        const salt = bytes.slice(0, SALT_LENGTH);
        const iv = bytes.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
        const ciphertext = bytes.slice(SALT_LENGTH + IV_LENGTH);

        // Generate key
        const keyMaterial = await getKeyMaterial(key);
        const derivedKey = await deriveKey(keyMaterial, salt);

        // Decrypt
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            derivedKey,
            ciphertext
        );

        // Decode and return
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (error) {
        console.error('Decryption failed:', error);
        throw new Error('Decryption failed');
    }
}

// Use Web Crypto API for strong encryption
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
        ["encrypt", "decrypt"]
    );
}

export async function encryptData(data: string): Promise<string> {
    try {
        // Generate random salt and IV
        const salt = window.crypto.getRandomValues(new Uint8Array(SALT_LENGTH));
        const iv = window.crypto.getRandomValues(new Uint8Array(IV_LENGTH));

        // Use a combination of timestamp and random values as the encryption password
        const timestamp = new Date().getTime().toString();
        const randomBytes = window.crypto.getRandomValues(new Uint8Array(16));
        const randomValue = Array.from(randomBytes)
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
        const password = `${timestamp}-${randomValue}`;

        // Generate key
        const keyMaterial = await getKeyMaterial(password);
        const key = await deriveKey(keyMaterial, salt);

        // Encrypt
        const encoder = new TextEncoder();
        const encoded = encoder.encode(data);

        const ciphertext = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            encoded
        );

        // Combine salt, IV, and ciphertext
        const result = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
        result.set(salt, 0);
        result.set(iv, salt.length);
        result.set(new Uint8Array(ciphertext), salt.length + iv.length);

        // Store the password separately (it's needed for decryption)
        localStorage.setItem('ndr-crypto-key', password);

        // Convert to base64 for storage
        const base64String = btoa(
            Array.from(result)
                .map(byte => String.fromCharCode(byte))
                .join('')
        );
        return base64String;
    } catch (error) {
        console.error('Encryption failed:', error);
        throw new Error('Encryption failed');
    }
}

export async function decryptData(encryptedData: string): Promise<string> {
    try {
        // Get the stored password
        const password = localStorage.getItem('ndr-crypto-key');
        if (!password) {
            throw new Error('Encryption key not found');
        }

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
        const keyMaterial = await getKeyMaterial(password);
        const key = await deriveKey(keyMaterial, salt);

        // Decrypt
        const decrypted = await window.crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            ciphertext
        );

        // Decode and return
        const decoder = new TextDecoder();
        return decoder.decode(decrypted);
    } catch (error) {
        console.error('Decryption failed:', error);
        // Clean up stored data on decryption failure
        localStorage.removeItem('ndr-crypto-key');
        throw new Error('Decryption failed');
    }
}

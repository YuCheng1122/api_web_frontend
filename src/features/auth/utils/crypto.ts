/**
 * 使用 Web Crypto API 進行加密/解密
 * 使用 AES-GCM 算法，這是一個強加密算法
 */

// 生成加密密鑰
const getKey = async () => {
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode('avocado-secure-key'),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode('avocado-salt'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
}

// 加密數據
export const encrypt = async (data: string): Promise<string> => {
  const key = await getKey();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const encoded = new TextEncoder().encode(data);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    encoded
  );

  // 將 IV 和加密數據合併並轉為 base64
  const encryptedArray = new Uint8Array(encrypted);
  const combined = new Uint8Array(iv.length + encryptedArray.length);
  combined.set(iv);
  combined.set(encryptedArray, iv.length);
  
  return btoa(Array.from(combined, byte => String.fromCharCode(byte)).join(''));
}

// 解密數據
export const decrypt = async (encryptedData: string): Promise<string> => {
  const key = await getKey();
  const combined = new Uint8Array(
    Array.from(atob(encryptedData), char => char.charCodeAt(0))
  );

  // 分離 IV 和加密數據
  const iv = combined.slice(0, 12);
  const data = combined.slice(12);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv
    },
    key,
    data
  );

  return new TextDecoder().decode(decrypted);
}

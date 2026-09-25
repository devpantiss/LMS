// Local prototype credentials. Production provisioning and email delivery require a backend.
export interface StudentCredential {
 loginId: string;
 salt: string;
 passwordHash: string;
 generatedAt: string;
}
const hex = (bytes: Uint8Array) => Array.from(bytes, b => b.toString(16).padStart(2, '0')).join('');
export async function hashPassword(password: string, salt: string) {
 const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
 const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt: new TextEncoder().encode(salt), iterations: 210000, hash: 'SHA-256' }, key, 256);
 return hex(new Uint8Array(bits));
}
export async function generateCredential(loginId?: string) {
 const password = `Ps!${hex(crypto.getRandomValues(new Uint8Array(12)))}`;
 const salt = hex(crypto.getRandomValues(new Uint8Array(16)));
 const credential: StudentCredential = { loginId: loginId || `PS-${crypto.randomUUID().toUpperCase()}`, salt, passwordHash: await hashPassword(password, salt), generatedAt: new Date().toISOString() };
 return { credential, password };
}

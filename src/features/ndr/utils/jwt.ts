export interface DecodedToken {
    sub: string;
    userId: string;
    scopes: string[];
    sessionId: string;
    iss: string;
    iat: number;
    exp: number;
    firstName: string;
    enabled: boolean;
    isPublic: boolean;
    tenantId: string;
    customerId: string;
}

export function decodeJWT(token: string): DecodedToken {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        return JSON.parse(jsonPayload);
    } catch (error) {
        throw new Error('Invalid token format');
    }
}

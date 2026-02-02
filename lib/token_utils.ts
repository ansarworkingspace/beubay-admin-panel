
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Correct named import

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

// Define the shape of your JWT payload
export interface CustomJwtPayload {
    exp: number;
    iat: number;
    sub: string;
    is_super_admin?: boolean;
    permissions?: string[];
    // Add other fields as needed
}

/**
 * Sets the access token in cookies.
 * (Compression logic omitted as per instructions)
 */
export const setAccessToken = (token: string) => {
    // In the future, add pako compression here.
    Cookies.set(ACCESS_TOKEN_KEY, token, { expires: 1 }); // Expires in 1 day
};

/**
 * Sets the refresh token in cookies.
 */
export const setRefreshToken = (token: string) => {
    Cookies.set(REFRESH_TOKEN_KEY, token, { expires: 7 }); // Expires in 7 days
};

/**
 * Retrieves the access token from cookies.
 * (Decompression logic omitted as per instructions)
 */
export const getAccessToken = (): string | undefined => {
    // In the future, add pako decompression here.
    return Cookies.get(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | undefined => {
    return Cookies.get(REFRESH_TOKEN_KEY);
};

/**
 * Clears all authentication tokens.
 */
export const clearAuthTokens = () => {
    Cookies.remove(ACCESS_TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
};

/**
 * Decodes the access token to get user info.
 */
export const getUserFromToken = (): CustomJwtPayload | null => {
    const token = getAccessToken();
    if (!token) return null;
    try {
        return jwtDecode<CustomJwtPayload>(token);
    } catch (error) {
        console.error("Failed to decode token", error);
        return null;
    }
};

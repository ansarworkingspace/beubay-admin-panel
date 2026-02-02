import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';

// Define public routes (although matcher handles most, this is a safety check)
const publicRoutes = ['/login', '/unauthorized'];

interface CustomJwtPayload {
    is_super_admin?: boolean;
    permissions?: { moduleName: string;[key: string]: any }[];
    exp?: number;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/v1';

async function handleTokenRefresh(request: NextRequest, refreshToken: string): Promise<NextResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/admin/auth/refresh-token`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();
        console.log("Middleware Refresh Response:", { status: response.status, data });

        // Handle various response structures
        // Log confirms structure: { data: { accessToken: "...", refreshToken: "..." } }
        let newAccessToken = data.token || data.accessToken || data.data?.token || data.data?.accessToken;
        let newRefreshToken = data.refreshToken || data.data?.refreshToken;

        if (response.ok && newAccessToken) {
            // Use redirect instead of next() to ensure the browser re-requests with the new cookies attached.
            // This avoids race conditions where the server component renders without the token.
            const res = NextResponse.redirect(request.url);

            // Update cookies
            res.cookies.set('access_token', newAccessToken, {
                path: '/',
                maxAge: 60 * 60 * 24, // 1 day
                sameSite: 'lax'
            });

            if (newRefreshToken) {
                res.cookies.set('refresh_token', newRefreshToken, {
                    path: '/',
                    maxAge: 60 * 60 * 24 * 7, // 7 days
                    sameSite: 'lax'
                });
            }

            return res;
        } else {
            console.error("Middleware Refresh Failed: Invalid response or missing token");
            return NextResponse.redirect(new URL('/login', request.url));
        }

    } catch (error) {
        console.error("Middleware Refresh Error:", error);
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // STRICT CHECK: Only protect dashboard routes
    // The matcher in config handles this mostly, but good to be explicit.
    if (!pathname.startsWith('/dashboard')) {
        return NextResponse.next();
    }

    // 1. Get tokens from cookies
    // 1. Get tokens from cookies (support both hyphen and underscore)
    const accessToken = request.cookies.get('access_token')?.value || request.cookies.get('access-token')?.value;
    const refreshToken = request.cookies.get('refresh_token')?.value || request.cookies.get('refresh-token')?.value;

    // 2. Handle missing tokens
    if (!accessToken) {
        if (refreshToken) {
            return await handleTokenRefresh(request, refreshToken);
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    // 3. Validate and Authorize
    try {
        const decoded = jwtDecode<CustomJwtPayload>(accessToken);

        // Check expiration
        const currentTime = Date.now() / 1000;
        if (decoded.exp && decoded.exp < currentTime) {
            if (refreshToken) {
                return await handleTokenRefresh(request, refreshToken);
            }
            return NextResponse.redirect(new URL('/login', request.url));
        }

        // CHECK SUPER ADMIN
        if (decoded.is_super_admin) {
            return NextResponse.next();
        } else {
            // Not super admin -> Unauthorized for dashboard access until further permissions implemented
            return NextResponse.redirect(new URL('/unauthorized', request.url));
        }

    } catch (error) {
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    // Only invoke middleware on dashboard routes
    matcher: ["/dashboard/:path*"],
};

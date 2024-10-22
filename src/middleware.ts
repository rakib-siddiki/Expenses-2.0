import { cookies, headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { REQUIRED_SECURITY_KEY, SECURITY_HEADER_NAME } from './configs/env';

export default function middleware(req: NextRequest) {
    const pathName = req.nextUrl.pathname;

    if (pathName === '/' || pathName.startsWith('/dashboard')) {
        // const userId = true;
        // Get the 'userId' cookie
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call
        const userId = cookies().get('userId')?.value as string;

        // If userId does not exist, redirect to the login page
        if (!userId || userId === '') {
            return NextResponse.redirect(new URL('/login', req.url));
        }

        // Optionally, you can add more checks here (e.g., role-based access)

        // If the cookie is valid, proceed to the requested page
        return NextResponse.next();
    }
    // Apply this middleware to API routes
    if (pathName.startsWith('/api')) {
        const reqHeaders = headers(); // Get all incoming request headers
        const securityKey = reqHeaders.get(SECURITY_HEADER_NAME); // Extract security key from request headers

        const response = NextResponse.next(); // Create a response object

        // Set the security header in the response
        response.headers.set(SECURITY_HEADER_NAME, REQUIRED_SECURITY_KEY);

        // Check if the security key from the request matches the required key
        if (securityKey !== REQUIRED_SECURITY_KEY) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Invalid security key',
                },
                { status: 403 },
            );
        }

        return response;
    }
    // Apply this middleware to all other routes
}

export const config = {
    matcher: [
        // Exclude files with a "." followed by an extension, which are typically static files.
        // Exclude files in the _next directory, which are Next.js internals.
        '/((?!.+\\.[\\w]+$|_next).*)',
        // Re-include any files in the api or trpc folders that might have an extension
        '/(api|trpc)(.*)',
        // '/dashboard/:path*',
    ],
};

import { NextResponse } from "next/server";

export function middleware(request) {
  const authPages = ["/login", "/signup"];
  const isAuthPage = authPages.includes(request.nextUrl.pathname);

  const token = request.cookies.get("authToken");

  // Assuming a function verifyToken exists that validates the token
  // const isValidToken = token && verifyToken(token); 

  if (isAuthPage && token) {
    // Redirect to homepage if token exists and is valid
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/signup", "/profile/:path*"],
};

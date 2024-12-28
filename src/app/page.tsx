import React from "react";
import "./styles/globals.css";
import { AuthContextProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <html lang="en">
        <head>
          {/* Optional: Meta tags for better SEO and mobile optimization */}
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <title>BlinkShare</title>
        </head>
        <body>
          {/* Wrap with both AuthContextProvider and UserProvider */}
          <AuthContextProvider>
            <UserProvider>
              <main>{children}</main>
            </UserProvider>
          </AuthContextProvider>
        </body>
      </html>
    </>
  );
}

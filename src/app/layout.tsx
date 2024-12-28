import React from "react";
import { AuthContextProvider } from "./context/AuthContext";
import { UserProvider } from "./context/UserContext";
import "./styles/globals.css";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>BlinkShare</title>
      </head>
      <body>
        <AuthContextProvider>
          <UserProvider>
            <main>{children}</main>
          </UserProvider>
        </AuthContextProvider>
      </body>
    </html>
  );
}

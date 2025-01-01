import Document, { Html, Head, Main, NextScript } from "next/document";
import { Inter } from "next/font/google";
import React from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-inter",
});

export default class MyDocument extends Document {
  render() {
    return (
      <Html lang="en" className={`${inter.variable}`}> 
        <Head>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link
            rel="icon"
            href="https://ucarecdn.com/bbc74eca-8e0d-4147-8a66-6589a55ae8d0/bark.webp"
          />
          {/* Additional external resources like stylesheets or scripts can go here */}
        </Head>
        <body className={`${inter.className}`}>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

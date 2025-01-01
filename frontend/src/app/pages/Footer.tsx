"use client";

import { motion } from "framer-motion";
import { Facebook, Linkedin, Youtube, X, Github } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="min-h-screen w-full bg-white flex flex-col justify-between pt-24 px-4 md:px-8">
      <div className="container mx-auto">
        <div className="flex flex-wrap justify-between items-start">
          <div className="w-full md:w-auto flex flex-col md:flex-row space-y-8 md:space-y-0 md:space-x-16 mb-8 md:mb-0">
            <div>
              <h2 className="text-lg font-semibold mb-4">Community</h2>
              <nav className="flex flex-col space-y-2 text-[#D0C8B9]">
                <Link className="hover:text-gray-700" href="/blog">
                  Blog
                </Link>
                <Link className="hover:text-gray-700" href="/support">
                  Support
                </Link>
              </nav>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Company</h2>
              <nav className="flex flex-col space-y-2 text-[#D0C8B9]">
                <Link className="hover:text-gray-700" href="/terms">
                  Terms of Use
                </Link>
                <Link className="hover:text-gray-700" href="/privacy">
                  Privacy Policy
                </Link>
                <Link className="hover:text-gray-700" href="/imprint">
                  Imprint
                </Link>
              </nav>
            </div>
            <div>
              <h2 className="text-lg font-semibold mb-4">Investors</h2>
              <nav className="flex flex-col space-y-2 text-[#D0C8B9]">
                <Link className="hover:text-gray-700" href="/token">
                  Token
                </Link>
              </nav>
            </div>
          </div>
          <div className="w-full md:w-auto flex space-x-10 justify-start md:justify-end">
            <Link className="text-[#D0C8B9] hover:text-gray-700" href="https://twitter.com">
              <X className="h-12 w-12" />
              <span className="sr-only">X</span>
            </Link>
            <Link className="text-[#D0C8B9] hover:text-gray-700" href="https://linkedin.com">
              <Linkedin className="h-12 w-12" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link className="text-[#D0C8B9] hover:text-gray-700" href="https://facebook.com">
              <Facebook className="h-12 w-12" />
              <span className="sr-only">Facebook</span>
            </Link>
            <Link className="text-[#D0C8B9] hover:text-gray-700" href="https://youtube.com">
              <Youtube className="h-12 w-12" />
              <span className="sr-only">YouTube</span>
            </Link>
            <Link className="text-[#D0C8B9] hover:text-gray-700" href="https://github.com/barkprotocol">
              <Github className="h-12 w-12" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center text-[150px] font-light leading-none tracking-tighter md:text-[210px] font-inter"
        >
          <span className="font-light">Blink</span>
          <span className="font-semibold">Share</span>
        </motion.div>
      </div>
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0 py-8 text-sm text-[#D0C8B9]">
          <p>© {currentYear} BARK Protocol. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

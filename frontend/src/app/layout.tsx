"use client";

import { Geist, Geist_Mono } from "next/font/google";
import React, { useEffect, useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: [ "latin" ],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: [ "latin" ],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [ isHydrated, setIsHydrated ] = useState(false);

  useEffect(() => {
    try {
      setIsHydrated(true);
    } catch (error) {
      console.error("Hydration error:", error);
    }
  }, []);


  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body className={ `${ geistSans.variable } ${ geistMono.variable }` }>
        { typeof window !== 'undefined' && isHydrated ? children : (
          <div style={ { display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" } }>
            <CircularProgress />
          </div>) }
      </body>
    </html>
  );
}

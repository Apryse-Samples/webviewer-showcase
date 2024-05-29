import type { Metadata } from "next";
import "./globals.css";
import { ChakraProvider } from "./ChakraProvider";
import { StoreProvider } from "./StoreProvider";
import { WebViewerProvider } from "./WebViewerProvider";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html>
      <body>
        <StoreProvider>
          <WebViewerProvider>
            <ChakraProvider>
              {children}
            </ChakraProvider>
          </WebViewerProvider>
        </StoreProvider>
      </body>
    </html>
  );
}

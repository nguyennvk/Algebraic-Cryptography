import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Dropdown from "@/components/dropdownLayout/Dropdown/Dropdown";
import "./globals.css"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Algebraic tool for cryptography",
  description: "This tool helps do some calculations related to field, primary test, basic arithmetic, modulo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="layout relative z-10">
          <Dropdown buttonText="Basic arithmetic" items={["Bezout's Identity", "Carmichael Function", "Power Modulo", "GCD", "Multiplicative Inverse"]}
            routes={["/basic_arithmetic/bezout", "/basic_arithmetic/carmichael", "/basic_arithmetic/power_modulo", "/basic_arithmetic/gcd", "/basic_arithmetic/mul_inverse"] }/>
          <Dropdown buttonText="Cryptography" items={["DLP", "RSA", "RSA with Pollard Rho"]} 
          routes={['/cryptography/dlp', '/cryptography/rsa', '/cryptography/rho_rsa']}/>
          <Dropdown buttonText="Elliptic Curve" items={["Determinant", "Point Addition", "Point Multiplication", "Point Order", "All Points"]}
          routes={['/elliptic_curve/det', '/elliptic_curve/add', '/elliptic_curve/mul', '/elliptic_curve/order', '/elliptic_curve/points']}/>
          <Dropdown buttonText="Field" items={["Generate Finite Field", "Polynomial GCD", "Polynomial Modulo"]} 
          routes={['/field/generate', '/field/poly_gcd', '/field/poly_mod']}/>
          <Dropdown buttonText="Primary Test" items={["Fermat", "Euler", "Miller Rabin"]} 
          routes={['/primary_test/fermat', '/primary_test/euler', '/primary_test/miller_rabin']}/>
        </div>
        {children}
      </body>
    </html>
  );
}

import type {Metadata} from 'next';
import { Epilogue, Manrope, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles

const epilogue = Epilogue({
  subsets: ['latin'],
  variable: '--font-headline',
  weight: ['700', '800', '900'],
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-label',
  weight: ['300', '500', '700'],
});

export const metadata: Metadata = {
  title: 'Golden Fortune - 马上有钱',
  description: 'Cyberpunk Chinese Casino App',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className="dark">
      <body className={`${epilogue.variable} ${manrope.variable} ${spaceGrotesk.variable} bg-[#131313] text-[#e5e2e1] font-sans selection:bg-[#efc20a] selection:text-[#3c2f00] overflow-hidden h-screen flex flex-col`} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

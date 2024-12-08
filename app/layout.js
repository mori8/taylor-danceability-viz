// app/layout.js
import ScrollProgress from './components/ui/ScrollProgress';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair' 
});

export const metadata = {
  title: 'The Curious Case of Taylor Swift\'s Danceability',
  description: 'An investigation into what makes a song truly danceable',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
      <body className="font-sans">
      <ScrollProgress />
        {children}
      </body>
    </html>
  );
}
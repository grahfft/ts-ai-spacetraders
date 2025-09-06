import type { Metadata } from 'next';
import './global.css';
import { AppChakraProvider } from '@spacetraders/ui-chakra';

export const metadata: Metadata = {
  title: 'SpaceTraders Site',
  description: 'Next.js app for SpaceTraders',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppChakraProvider>{children}</AppChakraProvider>
      </body>
    </html>
  );
}

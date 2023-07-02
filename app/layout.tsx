import './globals.css'
import appIcon from '@/public/image/favicon.ico';
import appleAppIcon from '@/public/image/Icon-1024.png';
import { Metadata } from 'next'
import { Athiti } from 'next/font/google' // Itim

const googleFont = Athiti({
    weight: '600',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Reminder-Me',
    description: 'Reminder-Me place remind and suggest by distance.',
    icons: {
        icon: appIcon.src,
        apple: appleAppIcon.src
    },
    appleWebApp: { 
        capable: true, 
        title: "Reminder Me", 
        statusBarStyle: "black-translucent" 
    }
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {
    return (
        <html lang="en">
            <body className={googleFont.className}>{children}</body>
        </html>
    )
}

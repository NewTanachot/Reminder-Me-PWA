import './globals.css'
import appIcon from '@/public/image/favicon.ico';
import appleAppIcon from '@/public/image/apple-icon.ico';
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
        apple: appIcon.src,
        icon: appleAppIcon.src
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

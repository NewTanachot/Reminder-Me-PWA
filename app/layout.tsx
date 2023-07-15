import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import appIcon from '@/public/image/web-icon/favicon.ico';
import appleAppIcon from '@/public/image/apple-icon/appstore_v2.png';
import { Metadata } from 'next'
import { Athiti } from 'next/font/google' // Itim

const googleFont = Athiti({
    weight: '600',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Reminder-Me',
    description: 'Reminder-Me place remind and suggest by distance.',
    viewport: { 
        width: "device-width",
        userScalable: false,
    },
    icons: {
        icon: appIcon.src,
        apple: appleAppIcon.src
    },
    appleWebApp: { 
        capable: true, 
        title: "Reminder Me", 
        statusBarStyle: "black"
    }
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <body className={googleFont.className}>
                {children}
            </body>
        </html>
    )
}

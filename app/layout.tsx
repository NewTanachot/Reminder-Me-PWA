import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'
import '@fortawesome/fontawesome-free/css/all.css';
import appIcon from '@/public/image/web-icon/favicon.ico';
import appleAppIcon from '@/public/image/apple-icon/appstore_v2.png';
import { Metadata } from 'next'
import { Athiti } from 'next/font/google' // Athiti, Itim, Sriracha

const googleFont = Athiti({
    // weight: '400',
    weight: '600',
    subsets: ['latin'],
});

export const metadata: Metadata = {
    title: 'Reminder-Map',
    description: 'Reminder-Map place remind and suggest by distance.',
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
        title: "Reminder Map", 
        statusBarStyle: "black-translucent"
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

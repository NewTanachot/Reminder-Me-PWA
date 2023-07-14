import './globals.css'
import 'bootstrap/dist/css/bootstrap.css'
import appIcon from '@/public/image/web-icon/favicon.ico';
import appleAppIcon from '@/public/image/apple-icon/appstore_v2.png';
import { Metadata } from 'next'
import { Athiti } from 'next/font/google' // Itim
import Link from 'next/link';

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
        statusBarStyle: "black-translucent"
    }
}

export default function RootLayout({ children, }: { children: React.ReactNode }) {

    return (
        <html lang="en">
            <body className={googleFont.className}>
            <nav className='bg-dark text-white px-2 py-2 pt-5 pt-sm-2'>
                    <div className='row'>
                        <div className='col text-start'>
                            <h6 className='m-0'>Remider-Me</h6>
                        </div>
                        <div className='col text-end'>
                            <Link href="/auth/login" className='h6 m-0 btn btn-light'>Hello, ds</Link>
                        </div>
                    </div>
            </nav>
                {children}
            </body>
        </html>
    )
}

import { ISplashScreenProps } from '@/model/propsModel';
import AppIcon from '@/public/image/web-icon/favicon.ico';

export default function SplashScreen({ softwareVersion }: ISplashScreenProps) {
    return <main className='w-100 h-100'>
        <div className="w-100 h-100 d-flex justify-content-center align-items-center text-center bg-steelblue">
            <div>
                <img
                    src={AppIcon.src}
                    alt="appSplashScreen.jpg"
                    width={150}
                    height={150}
                />
                <span className='text-peach'>
                    <p className='mt-5 mb-4 display-1'>
                        Reminder Map
                    </p>
                    <p className='display-5'>
                        &copy; 2023  DevAsNew
                        </p>
                    <h3>
                        Software Version 
                        <br />
                        v{softwareVersion}
                    </h3>
                </span>
            </div>
        </div>
    </main>
}
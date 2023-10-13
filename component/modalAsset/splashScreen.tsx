import { ISplashScreenProps } from '@/model/propsModel';
import AppIcon from '@/public/image/web-icon/favicon.ico';

export default function SplashScreen({ softwareVersion }: ISplashScreenProps) {
    return (
        <div className="w-100 h-100 d-flex justify-content-center align-items-center text-center font-monospace bg-cornflowerblue">
            <div>
                <img
                    src={AppIcon.src}
                    alt="appSplashScreen.jpg"
                    width={150}
                    height={150}
                />
                <span className='text-milk-yellow'>
                    <p className='my-5 display-2'>"Reminder Map"</p>
                    <h1>&copy; 2023  DevAsNew</h1>
                    <h4>
                        Software Version 
                        <br />
                        v{softwareVersion}
                    </h4>
                </span>
            </div>
        </div>
    )
}
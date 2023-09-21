import appSplashScreen from '@/public/image/Splash Screen.png';

export default function SplashScreen() {
    return (
        <div className='w-100 h-100'>
            <img src={appSplashScreen.src} alt="appSplashScreen.jpg" width="100%" height="100%" />
        </div>
    )
}
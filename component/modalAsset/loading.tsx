import loadingImage from '@/public/image/loading2.png';

export default function Loading() {
    return (
        <>
            <div className="text-center m-5">
                <img className="spin-rotate" src={loadingImage.src} alt="loadingImage" width={60} height={60} />
            </div>
        </>
    )
}
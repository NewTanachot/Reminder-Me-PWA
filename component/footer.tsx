import { PwaCurrentPage } from "@/model/enum_model";
import { IFooterProps } from "@/model/props_model";

export default function Footer({ changeCurrentPage }: IFooterProps) {

    return (
        <footer className='fixed-bottom bg-viridian-green px-2 py-2 pb-4 shadow-top'>
            <div className='d-flex justify-content-around align-items-center'>
                <button 
                    type="button" 
                    className="btn btn-lg text-white border-0"
                    onClick={() => changeCurrentPage(PwaCurrentPage.ReminderList)}
                >
                    <i className="bi bi-folder text-footer-size"></i>
                </button>
                <button
                    type="button" 
                    className="btn btn-lg text-white border-0"
                    onClick={() => changeCurrentPage(PwaCurrentPage.MapView)}
                >
                    <i className="bi bi-geo-alt text-footer-size"></i>
                </button>
                <button 
                    type="button" 
                    className="btn btn-lg text-white border-0"
                    onClick={() => changeCurrentPage(PwaCurrentPage.Register)}
                >
                    <i className="bi bi-globe-americas text-footer-size"></i>
                </button>
                <button
                    type="button"
                    className="btn btn-lg text-white border-0"
                    onClick={() => changeCurrentPage(PwaCurrentPage.Login)}
                >
                    <i className="bi bi-person-circle text-footer-size"></i>
                </button>
            </div>
        </footer>
    )
}
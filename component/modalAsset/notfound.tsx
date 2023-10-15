import { INotFoundProps } from "@/model/propsModel";

export default function NotFound({ isDarkTheme }: INotFoundProps) {

    let textColorTheme;

    if (isDarkTheme) {
        textColorTheme = "text-white";
    }
    else {
        textColorTheme = "text-dark";
    }

    return (
        <>
            <h6 className={`text-center mt-5 font-monospace ${textColorTheme}`}>
                Empty card,
                <br /> <br />
                Place add your new location for using our application.
            </h6>
        </>
    )
}
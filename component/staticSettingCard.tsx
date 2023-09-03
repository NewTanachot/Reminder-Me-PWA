import { IStaticSettingCardProps } from "@/model/props_model"

export default function StaticSettingCard({ cardIcon, cardTitle, cardInfo }: IStaticSettingCardProps) {

    return (
    <>
        <div className="card shadow-sm bg-peach text-viridian-green my-4">
            <div className="card-body m-2 p-0">
                <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 ms-2">
                        <i style={{ fontSize: "2.5rem"}} className={cardIcon}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <h5 className="m-0 lh-1">
                            {cardTitle}:
                            <br />
                            <span className="text-secondary">
                                {cardInfo}
                            </span>
                        </h5>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}
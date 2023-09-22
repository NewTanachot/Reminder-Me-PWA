import { IStaticSettingCardProps } from "@/model/propsModel"

export default function StaticSettingCard({ cardIcon, cardTitle, cardInfo }: IStaticSettingCardProps) {

    return (
    <>
        <div className="card shadow-sm bg-peach text-viridian-green mb-3">
            <div className="card-body m-2 p-0">
                <div className="d-flex align-items-center">
                    <div className="flex-shrink-0 ms-2">
                        <i style={{ fontSize: "2rem"}} className={cardIcon}></i>
                    </div>
                    <div className="flex-grow-1 ms-3">
                        <h6 className="m-0 lh-1">
                            {cardTitle}:
                            <br />
                            <span className="text-secondary">
                                {cardInfo}
                            </span>
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}
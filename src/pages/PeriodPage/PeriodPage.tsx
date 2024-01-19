import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router"

import { DateInfo } from "models/dateInfo";

import Loader from "components/Loader/Loader";
import PictureGrid from "components/PictureGrid/PictureGrid";

import ApiController from "logic/storage/ApiController";

import './PeriodPage.css';

export default function PeriodPage() {
    const params = useParams();
    const [dataList, setDataList] = useState<DateInfo[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const rows = useMemo(() =>
        Math.floor(dataList.length / 7)
        , [dataList]
    )
    const columns = useMemo(() =>
        dataList.length > 7 ? 7 : dataList.length
        , [dataList]
    )

    useEffect(() => {
        setIsLoading(true)
        const period = params.period
            ?.split('-')
            .map(stringDate => stringDate.replaceAll('.', '-'))
            || ['0000-00-00', '0000-00-00']

        ApiController.getPeriodData(period[0], period[1]).then(
            loadedWeekData => {
                setDataList(loadedWeekData);
                setIsLoading(false);
            }
        )
    }, [params]);

    return <div className="PeriodPage_wrapper">
        {isLoading &&
            <Loader />
        }
        {!isLoading &&
            <div className="PeriodPage_body">
                <header>
                    <h1>
                        Hover over the image and click to go to the full picture description page.
                    </h1>
                </header>
                <PictureGrid
                    dates={dataList}
                    rows={rows}
                    columns={columns}
                    cellHeight={128}
                    cellWidth={128}
                />
            </div>
        }
    </div>
}
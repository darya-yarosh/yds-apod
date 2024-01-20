import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AstroPicData } from "models/astroPicData";

import Loader from "components/Loader/Loader";
import PictureGrid from "components/PictureGrid/PictureGrid";

import ApiController from "logic/storage/ApiController";
import { 
    checkIsPeriodCorrect, 
    convertDateToYYYYMMDD, 
    fixToCorrectPeriod
} from "logic/utils/dateConverter";

import './PeriodPage.css';

export default function PeriodPage() {
    const navigate = useNavigate();
    const params = useParams();

    const [dataList, setDataList] = useState<AstroPicData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        setIsLoading(true)
        const period = params.period
            ?.split('-')
            .map(stringDate => stringDate.replaceAll('.', '-'))
            || ['0000-00-00', '0000-00-00']

        function goToCorrectPeriod() {

            const fixedPeriod = fixToCorrectPeriod(
                period.map((date: string) => new Date(date))
            ).map(date =>
                convertDateToYYYYMMDD(new Date(date), '.')
            )

            navigate(`/period/${fixedPeriod[0]}-${fixedPeriod[1]}`)
        }

        const isCorrectPeriod = checkIsPeriodCorrect(
            [
                new Date(period[0]),
                new Date(period[1])
            ]
        );

        if (!isCorrectPeriod) {
            goToCorrectPeriod()
        } else {
            ApiController.getPeriodData(new Date(period[0]), new Date(period[1]))
                .then(
                    loadedWeekData => {
                        setDataList(loadedWeekData);
                        setIsLoading(false);
                    }
                )
                .catch(() => {
                    goToCorrectPeriod()
                });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
                    cellHeight={128}
                    cellWidth={128}
                />
            </div>
        }
    </div>
}
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

import { AstroPicData } from "models/astroPicData";

import Video from "components/Video/Video";
import Loader from "components/Loader/Loader";
import Picture from "components/Picture/Picture";
import PictureGrid from "components/PictureGrid/PictureGrid";

import ApiController from "logic/storage/ApiController";
import { checkIsDateCorrect, checkIsPeriodCorrect, convertDateToYYYYMMDD, fixToCorrectDate } from "logic/utils/dateConverter";

import './DatePage.css';

export default function DatePage() {
    const navigate = useNavigate();
    const params = useParams();

    const [data, setData] = useState<AstroPicData>();
    const [weekData, setWeekData] = useState<AstroPicData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const selectedDate = useMemo(() => params.date || '', [params.date]);

    const renderMedia = useCallback(() => {
        if (data?.media_type === "image") {
            return (
                <Picture
                    src={data?.url || ""}
                    alt={`Image of ${data?.title}`}
                    height={712}
                    width={712}
                    isCover={false}
                />
            );
        } else if (data?.media_type === "video") {
            return (
                <Video
                    src={data?.url || ""}
                    title={data?.title}
                    height={712}
                    width={712}
                    withControls={true}
                />
            );
        } else {
            return (
                <Picture
                    src={""}
                    alt={`Has not image`}
                    height={712}
                    width={712}
                    isCover={false}
                />
            );
        }
    }, [data]);

    useEffect(() => {
        setIsLoading(true);
        function goToCorrectDate() {
            const fixedDate = convertDateToYYYYMMDD(fixToCorrectDate(new Date(selectedDate)), '-');
            navigate(`/date/${fixedDate}`)
        }

        const isCorrectDate = checkIsDateCorrect(new Date(selectedDate));
        if (!isCorrectDate) {
            goToCorrectDate()
        } else {
            ApiController.getDateData(new Date(selectedDate))
                .then(loadedData => {
                    setData(loadedData)
                })
                .catch(() => {
                    goToCorrectDate()
                })
        }

        const dayWeekAgo = new Date(new Date(selectedDate).getTime() - 7 * 24 * 60 * 60 * 1000);
        const yesterday = new Date(new Date(selectedDate).getTime() - 1 * 24 * 60 * 60 * 1000);

        const isCorrectPeriod = checkIsPeriodCorrect([dayWeekAgo, yesterday]);
        if (!isCorrectPeriod) {
            goToCorrectDate()
        } else {
            ApiController.getPeriodData(dayWeekAgo, yesterday)
                .then(
                    loadedWeekData => {
                        setWeekData(loadedWeekData);
                        setIsLoading(false);
                    })
                .catch(() => {
                    goToCorrectDate()
                })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [params])

    return <div className="DatePage_wrapper">
        {isLoading &&
            <Loader />
        }
        {!isLoading &&
            <div className="DatePage_body">
                <div className="SelectedDateInfo">
                    <section className="Date_PictureInfo">
                        {renderMedia()}
                    </section>
                    <section className="Date_TextInfo">
                        <header>
                            <h1 className="Date_title">{data?.title}</h1>
                            <h2 className="Date_copyright">{data?.copyright}</h2>
                        </header>
                        <p className="Date_explanation">{data?.explanation}</p>
                    </section>
                </div>
                <div className="WeekDateInfo">
                    <PictureGrid
                        dates={weekData}
                        cellHeight={72}
                        cellWidth={72}
                    />
                </div>
            </div>
        }
    </div>
}

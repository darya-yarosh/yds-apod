import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom"

import { DateInfo } from "models/dateInfo";

import Video from "components/Video/Video";
import Loader from "components/Loader/Loader";
import Picture from "components/Picture/Picture";
import PictureGrid from "components/PictureGrid/PictureGrid";

import ApiController from "logic/storage/ApiController";
import { convertDateToYYYYMMDD } from "logic/utils/dateConverter";

import './DatePage.css';

export default function DatePage() {
    const params = useParams();

    const [data, setData] = useState<DateInfo>();
    const [weekData, setWeekData] = useState<DateInfo[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const selectedDate = useMemo(() => params.date || '', [params.date]);

    useEffect(() => {
        setIsLoading(true);
        ApiController.getDateData(selectedDate)
            .then(loadedData => {
                setData(loadedData)
            })

        const dayWeekAgo = convertDateToYYYYMMDD(
            new Date(new Date(selectedDate).getTime() - 7 * 24 * 60 * 60 * 1000),
            '-'
        )
        const tomorrow = convertDateToYYYYMMDD(
            new Date(new Date(selectedDate).getTime() - 1 * 24 * 60 * 60 * 1000),
            '-'
        )
        ApiController.getPeriodData(dayWeekAgo, tomorrow)
            .then(
                loadedWeekData => {
                    setWeekData(loadedWeekData);
                    setIsLoading(false);
                });
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
                        {data?.media_type === "image" &&
                            <Picture
                                src={data?.url || ""}
                                alt={`Image of ${data?.title}`}
                                height={712}
                                width={712}
                                isCover={false}
                            />
                        }
                        {data?.media_type === "video" &&
                            <Video
                                src={data?.url || ""}
                                title={data?.title}
                                height={712}
                                width={712}
                                withControls={true}
                            />
                        }
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
                        rows={1}
                        columns={7}
                        cellHeight={72}
                        cellWidth={72}
                    />
                </div>
            </div>
        }
    </div>
}
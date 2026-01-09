import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

import { AstroPicData } from "models/astroPicData";

import Video from "components/Video/Video";
import Loader from "components/Loader/Loader";
import Picture from "components/Picture/Picture";
import PictureGrid from "components/PictureGrid/PictureGrid";

import ApiController from "logic/storage/ApiController";
import { checkIsDateCorrect, checkIsPeriodCorrect } from "logic/utils/dateConverter";

import './DatePage.css';
import { goToCorrectDate } from "./utils";

export default function DatePage() {
    const navigate = useNavigate();
    const params = useParams();

    /**
     * State
     */
    const [data, setData] = useState<AstroPicData>();
    const [weekData, setWeekData] = useState<AstroPicData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const selectedDate = useMemo(() => params.date || '', [params.date]);

    /**
     * Renders
     */
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
        }

        if (data?.media_type === "video") {
            return (
                <Video
                    src={data?.url || ""}
                    title={data?.title}
                    height={712}
                    width={712}
                    withControls={true}
                />
            );
        }

        return (
            <Picture
                src={""}
                alt={`Has not image`}
                height={712}
                width={712}
                isCover={false}
            />
        );
    }, [data]);

    const renderContent = useCallback(() => {
        if (isLoading) {
            return <Loader  />;
        }

        return (
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
        );
    }, [isLoading, data, weekData, renderMedia]);

    /**
     * Handlers
     */
    const handleGetDate = useCallback(async () => {
        const isCorrectDate = checkIsDateCorrect(new Date(selectedDate));

        if (!isCorrectDate) {
            goToCorrectDate(selectedDate, navigate);
            return;
        }

        await ApiController.getDateData(new Date(selectedDate))
            .then((loadedData) => {
                setData(loadedData)
            })
            .catch(() => {
                goToCorrectDate(selectedDate, navigate);
            })
    }, [selectedDate, navigate]);

    const handleGetPeriod = useCallback(async () => {
        const dayWeekAgo = new Date(new Date(selectedDate).getTime() - 7 * 24 * 60 * 60 * 1000);
        const yesterday = new Date(new Date(selectedDate).getTime() - 1 * 24 * 60 * 60 * 1000);

        const isCorrectPeriod = checkIsPeriodCorrect([dayWeekAgo, yesterday]);
        if (!isCorrectPeriod) {
            goToCorrectDate(selectedDate, navigate);
            return;
        }

        await ApiController.getPeriodData(dayWeekAgo, yesterday)
            .then(
                loadedWeekData => {
                    setWeekData(loadedWeekData);
                })
            .catch((error: Error) => {
                const { message } = error;
                const errorCode = message ? message.split(":")[0] : null;

                if (errorCode === "400") {
                    navigate("/error/400", {
                        "state": {
                            message: "Invalid date"
                        }
                    });
                    // goToCorrectDate();
                }  else if (errorCode === "429") {
                    navigate("/error/429", {
                        "state": {
                            message: "Too many requests"
                        }
                    });
                } else if (errorCode === "504") {
                    navigate("/error/504", {
                        "state": {
                            message: "Timeout gateway"
                        }
                    });
                }
            });
    }, [selectedDate, navigate]);

    const handleInit = useCallback(async () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        await handleGetDate();
        await handleGetPeriod();
        setIsLoading(false);
    }, [isLoading, handleGetDate, handleGetPeriod]);

    /**
     * Effects
     */
    useEffect(() => {
        handleInit()
    }, [
        // selectedDate,
        handleInit
    ])

    return (
        <div className="DatePage_wrapper">
            {renderContent()}
        </div>
    );
}

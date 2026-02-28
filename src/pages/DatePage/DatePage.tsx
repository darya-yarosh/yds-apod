import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import { isTMA } from "@telegram-apps/sdk";

import { TOrNull } from "models/TOrNull";
import { AstroPicData } from "models/astroPicData";

import { useFavoritesData } from "hooks/telegram/useFavoritesData";

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
    const [data, setData] = useState<TOrNull<AstroPicData>>(null);
    const [weekData, setWeekData] = useState<AstroPicData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [selectedDate, setSelectedDate] = useState(params.date || "");

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

    const { favorites, update} = useFavoritesData();

    const isActive = useMemo(() => {
        if (favorites === null || favorites.length === 0) {
            return false;
        }

        return !!favorites.find((el) => el === selectedDate);
    }, [favorites, selectedDate]);

    const changeFavorite = useCallback(async () => {
        if (isActive) {
            await update((favorites || []).filter((el) => el !== selectedDate));
        } else {
            await update([...(favorites || []), selectedDate]);
        }
    }, [favorites, isActive, selectedDate, update]);

    const renderFavouriteButton = useCallback(() => {
        if (!isTMA()) {
            return null;
        }

        const star = isActive ? '🌟' : '⭐';

        return (
            <>
                <div className="FavoriteButton_wrapper" onClick={changeFavorite}>
                    <span className="FavoriteButton_star">{`${star}`}</span> 
                    <span className="FavoriteButton_label">{`Add favorite`}</span>
                </div>
            </>
        );
    }, [isActive, changeFavorite]);

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
                        {renderFavouriteButton()}
                        <header>
                            <h1 className="Date_title">
                                {data?.title}
                            </h1>
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
                        showFavoriteButton={true}
                    />
                </div>
            </div>
        );
    }, [isLoading, data, weekData, renderMedia, renderFavouriteButton]);

    /**
     * Handlers
     */
    const handleGetDate = useCallback(async (date: string) => {
        const isCorrectDate = checkIsDateCorrect(new Date(date));

        if (!isCorrectDate) {
            goToCorrectDate(date, navigate);
            return;
        }

        await ApiController.getDateData(new Date(date))
            .then((loadedData) => {
                setData(loadedData)
            })
            .catch(() => {
                goToCorrectDate(date, navigate);
            })
    }, [navigate]);

    const handleGetPeriod = useCallback(async (date: string) => {
        const dayWeekAgo = new Date(new Date(date).getTime() - 7 * 24 * 60 * 60 * 1000);
        const yesterday = new Date(new Date(date).getTime() - 1 * 24 * 60 * 60 * 1000);

        const isCorrectPeriod = checkIsPeriodCorrect([dayWeekAgo, yesterday]);
        if (!isCorrectPeriod) {
            goToCorrectDate(date, navigate);
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
    }, [navigate]);

    const handleInit = useCallback(async (date: string) => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        await handleGetDate(date);
        await handleGetPeriod(date);
        setIsLoading(false);
    }, [isLoading, handleGetDate, handleGetPeriod]);

    /**
     * Effects
     */
    useEffect(() => {
        const currentDate = params.date;

        const isDataNotLoaded = data === null && selectedDate;
        const isDateUpdated = selectedDate !== currentDate;

        if ((isDataNotLoaded || isDateUpdated) && currentDate) {
            setSelectedDate(currentDate);
            handleInit(currentDate)
        }
    }, [
        selectedDate,
        data,
        params,
        handleInit
    ])

    return (
        <div className="DatePage_wrapper">
            {renderContent()}
        </div>
    );
}

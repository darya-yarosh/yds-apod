import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { TOrNull } from "models/TOrNull";
import { AstroPicData } from "models/astroPicData";

import Loader from "components/Loader/Loader";
import PictureGrid from "components/PictureGrid/PictureGrid";

import { useFavoritesData } from "hooks/telegram/useFavoritesData";
import { useDeveloperClassName } from "hooks/telegram/useDeveloperClassname";

import ApiController from "logic/storage/ApiController";
import {
    checkIsPeriodCorrect,
} from "logic/utils/dateConverter";

import './FavoritesPage.css';

export default function FavoritesPage() {
    const developerClassName = useDeveloperClassName();

    const navigate = useNavigate();

    /**
     * State
     */
    const { favorites, update} = useFavoritesData();
    
    const [dataList, setDataList] = useState<TOrNull<Array<AstroPicData>>>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [selectedPeriod, setSelectedPeriod] = useState("");

    /**
     * Handlers
     */
    const removeFavorite = useCallback(async (selectedDate: string) => {
        if (!favorites) {
            return;
        }
        
        const isActive = favorites?.find((el) => el === selectedDate)
        if (isActive) {
            await update(favorites.filter((el) => el !== selectedDate));
            setDataList((current) => (current || []).filter(el => el.date !== selectedDate));
        }
    }, [favorites, update]);
    /**
     * Renders
     */
    const renderContent = useCallback(() => {
        if (isLoading) {
            return <Loader />;
        }

        const showGrid = !(
            !dataList
            || (!favorites || favorites.length === 0)
        );

        return (
            <div className="PeriodPage_body">
                <header>
                    <h1>
                        {(!dataList && favorites && favorites.length > 0) && "Something went wrong"}
                        {(!favorites || favorites.length === 0) && "List is empty"}
                        {showGrid && "Favorite photos"}
                    </h1>
                </header>
                {showGrid && 
                    <PictureGrid
                        dates={dataList}
                        cellHeight={128}
                        cellWidth={128}
                        showFavoriteButton={true}
                        onClick={removeFavorite}
                    />
                }
            </div>
        );
    }, [isLoading, dataList, favorites, removeFavorite]);

    /**
     * Handlers
     */
    const handleGetPeriod = useCallback(async (period: string) => {
        const formattedPeriod = (
            period
                ?.split('-')
                .map(stringDate => stringDate.replaceAll('.', '-'))
            ) || ['0000-00-00', '0000-00-00'];

        const isCorrectPeriod = checkIsPeriodCorrect(
            [
                new Date(formattedPeriod[0]),
                new Date(formattedPeriod[1])
            ]
        );

        if (!isCorrectPeriod) {
            return;
        }

        await ApiController.getPeriodData(new Date(formattedPeriod[0]), new Date(formattedPeriod[1]))
            .then((loadedWeekData) => {
                const filteredDataList = loadedWeekData.filter((data) => 
                    favorites ? favorites.includes(data.date) : true
                );
                setDataList(filteredDataList);
                setIsLoading(false);
            })
            .catch((error) => {
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
    }, [favorites, navigate]);

    const handleInit = useCallback(async (period: string) => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        await handleGetPeriod(period);
        setIsLoading(false);
    }, [isLoading, handleGetPeriod]);

    const currentPeriod = useMemo(() => {
        if (!favorites) {
            return null;
        }

        let minDate: TOrNull<string> = null;
        let maxDate: TOrNull<string> = null;
        favorites.forEach((element) => {
            if (!minDate) {
                minDate = element;
            }

            if (!maxDate) {
                maxDate = element;
            }

            if (new Date(element).getTime() < new Date(minDate).getTime()) {
                minDate = element;
            }

            if (new Date(element).getTime() > new Date(maxDate).getTime()) {
                maxDate = element;
            }
        })

        if (typeof minDate === "string" && typeof maxDate === "string") {
            return `${(minDate as string).replaceAll("-", ".")}-${(maxDate as string).replaceAll("-", ".")}`;
        }

        return null;
    }, [favorites]);

    useEffect(() => {
        if (!currentPeriod) {
            return;
        }

        const isDataNotLoaded = selectedPeriod && dataList === null;
        const isPeriodUpdated = selectedPeriod !== currentPeriod;

        if ((isDataNotLoaded || isPeriodUpdated) && currentPeriod && (dataList === null || dataList?.length === 0)) {
            setSelectedPeriod(currentPeriod);
            handleInit(currentPeriod)
        }
    }, [
        currentPeriod,
        dataList,
        selectedPeriod,
        handleInit
    ]);

    return (
        <div className="PeriodPage_wrapper">
            <span className={developerClassName}>{JSON.stringify(favorites)}</span>
            <span className={developerClassName}>{currentPeriod}</span>
            {renderContent()}
        </div>
    );
}

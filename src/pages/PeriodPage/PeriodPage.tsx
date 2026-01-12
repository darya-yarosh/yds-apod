import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { TOrNull } from "models/TOrNull";
import { AstroPicData } from "models/astroPicData";

import Loader from "components/Loader/Loader";
import PictureGrid from "components/PictureGrid/PictureGrid";

import ApiController from "logic/storage/ApiController";
import {
    checkIsPeriodCorrect,
} from "logic/utils/dateConverter";

import './PeriodPage.css';
import { goToCorrectPeriod } from "./utils";

export default function PeriodPage() {
    const navigate = useNavigate();
    const params = useParams();

    /**
     * State
     */
    const [dataList, setDataList] = useState<TOrNull<Array<AstroPicData>>>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const [selectedPeriod, setSelectedPeriod] = useState(params.period || "");

    /**
     * Renders
     */
    const renderContent = useCallback(() => {
        if (isLoading) {
            return <Loader />;
        }

        if (!dataList) {
            return <span>{"Something went wrong."}</span>;
        }

        return (
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
        );
    }, [isLoading, dataList]);

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
            goToCorrectPeriod(formattedPeriod, navigate)
            return;
        }

        await ApiController.getPeriodData(new Date(formattedPeriod[0]), new Date(formattedPeriod[1]))
            .then(
                loadedWeekData => {
                    setDataList(loadedWeekData);
                    setIsLoading(false);
                }
            )
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
    }, [navigate]);

    const handleInit = useCallback(async (period: string) => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        await handleGetPeriod(period);
        setIsLoading(false);
    }, [isLoading, handleGetPeriod]);

    useEffect(() => {
        const currentPeriod = params.period;

        const isDataNotLoaded = selectedPeriod && dataList === null;
        const isPeriodUpdated = selectedPeriod !== currentPeriod;

        if ((isDataNotLoaded || isPeriodUpdated) && currentPeriod) {
            setSelectedPeriod(currentPeriod);
            handleInit(currentPeriod)
        }
    }, [
        params,
        dataList,
        selectedPeriod,
        handleInit
    ]);

    return (
        <div className="PeriodPage_wrapper">
            {renderContent()}
        </div>
    );
}

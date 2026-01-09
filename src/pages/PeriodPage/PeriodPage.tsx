import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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
    const [dataList, setDataList] = useState<AstroPicData[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const selectedPeriod = useMemo(() => params.period || '', [params.period]);

    /**
     * Renders
     */
    const renderContent = useCallback(() => {
        if (isLoading) {
            return <Loader />;
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
    const handleGetPeriod = useCallback(async () => {
        const period = (
            selectedPeriod
                ?.split('-')
                .map(stringDate => stringDate.replaceAll('.', '-'))
            ) || ['0000-00-00', '0000-00-00'];

        const isCorrectPeriod = checkIsPeriodCorrect(
            [
                new Date(period[0]),
                new Date(period[1])
            ]
        );

        if (!isCorrectPeriod) {
            goToCorrectPeriod(period, navigate)
            return;
        }

        await ApiController.getPeriodData(new Date(period[0]), new Date(period[1]))
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
    }, [selectedPeriod, navigate]);

    const handleInit = useCallback(async () => {
        if (isLoading) {
            return;
        }

        setIsLoading(true);
        await handleGetPeriod();
        setIsLoading(false);
    }, [isLoading, handleGetPeriod]);

    useEffect(() => {
        handleInit()
    }, [
        selectedPeriod,
        handleInit
    ]);

    return (
        <div className="PeriodPage_wrapper">
            {renderContent()}
        </div>
    );
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

import Loader from "components/Loader/Loader";

import { convertDateToYYYYMMDD, getTodayDate } from "logic/utils/dateConverter";

export default function MainPage() {
    const navigate = useNavigate();

    const todayDate = convertDateToYYYYMMDD(getTodayDate(), '-');

    useEffect(() => {
        navigate(`/date/${todayDate}`)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return <Loader />
}
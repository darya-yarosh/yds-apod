import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

import Loader from "components/Loader/Loader";

import { convertDateToYYYYMMDD, getTodayUTCDate } from "logic/utils/dateConverter";

export default function MainPage() {
    const navigate = useNavigate();

    const todayDate = convertDateToYYYYMMDD(getTodayUTCDate(), '-');

    useEffect(() => {
        navigate(`/date/${todayDate}`)
    }, [todayDate, navigate])

    return <Loader />
}

import { useEffect } from "react";
import { useNavigate } from "react-router-dom"

import Loader from "components/Loader/Loader";

import { convertDateToYYYYMMDD, getTodayUTCDate } from "logic/utils/dateConverter";

export default function MainPage() {
    const navigate = useNavigate();

    const todayDate = convertDateToYYYYMMDD(getTodayUTCDate(), '-');
    const tg = (window as any).Telegram?.WebApp;
    
    useEffect(() => {
        console.log("tg?", tg);
        if (tg) {
            tg.expand();
            const user = tg.initDataUnsafe.user;
            console.log(user);
        }
    }, [tg]);

    useEffect(() => {
        navigate(`/date/${todayDate}`)
    }, [todayDate, navigate])

    return <Loader />
}

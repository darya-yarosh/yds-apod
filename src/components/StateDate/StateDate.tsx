import { useMemo } from "react";
import { useNavigate, useParams } from "react-router";

import LIMITS from "models/limits";

import { convertDateToYYYYMMDD, getTodayUTCDate } from "logic/utils/dateConverter";

export default function StateDate() {
    const navigate = useNavigate();
    const params = useParams();

    const todayDate = convertDateToYYYYMMDD(getTodayUTCDate(), '-');
    const date = useMemo(() => params.date
        || todayDate, [params.date, todayDate]);

    function dateOnChange(event: React.ChangeEvent<HTMLInputElement>) {
        if (date < LIMITS.minDateStr || date > LIMITS.maxDateStr) {
            event.preventDefault();
            window.alert(`Invalid date: date should be in range ${LIMITS.minDate}-${LIMITS.maxDate}.`)
            return;
        }

        const newDate: Date = new Date(event.target.value) || new Date();
        navigate(`/date/${convertDateToYYYYMMDD(newDate, '-')}`,)
    }

    return <>
        <p>Date: {date}</p>
        <input
            type="date"
            min={LIMITS.minDateStr}
            max={LIMITS.maxDateStr}
            title={"Selected date"}
            value={date}
            onChange={dateOnChange}
        />
    </>
}
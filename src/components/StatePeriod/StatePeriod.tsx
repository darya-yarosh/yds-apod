import { useState } from "react";
import { useNavigate, useParams } from "react-router";

import LIMITS from "models/limits";

export default function StatePeriod() {
    const navigate = useNavigate();
    const params = useParams();

    const [period, setPeriod] = useState<string[]>(
        params.period
            ?.split('-')
            .map(stringDate => stringDate.replaceAll('.', '-'))
        || ['0000-00-00', '0000-00-00']
    )

    function sendPeriod() {
        if (period[0] < LIMITS.minDateStr || period[1] > LIMITS.maxDateStr) {
            window.alert(`Invalid period date: period should be in range ${LIMITS.minDate}-${LIMITS.maxDate}.`)
            return;
        }

        const newPeriod = period
            .map(date => date.replaceAll('-', '.'))
            .join('-');
        navigate(`/period/${newPeriod}`)
    }

    return <>
        <p>Period: {params.period || ''}</p>
        <div className="Header_periodSelector">
            <section>
                <input
                    type="date"
                    min={LIMITS.minDateStr}
                    max={LIMITS.maxDateStr}
                    title={"Start period date"}
                    value={period[0]}
                    onChange={(event) => setPeriod([event.target.value, period[1]])}
                />
                <span>-</span>
                <input
                    type="date"
                    min={LIMITS.minDateStr}
                    max={LIMITS.maxDateStr}
                    title={"End period date"}
                    value={period[1]}
                    onChange={(event) => setPeriod([period[0], event.target.value])}
                />
            </section>
            <button onClick={sendPeriod}>SHOW</button>
        </div>
    </>
}
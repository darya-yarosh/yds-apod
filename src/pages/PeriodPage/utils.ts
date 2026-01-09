import { NavigateFunction } from "react-router-dom";

import { convertDateToYYYYMMDD, fixToCorrectPeriod } from "logic/utils/dateConverter";

export const goToCorrectPeriod = (period: Array<string>, navigate: NavigateFunction) => {
    const fixedPeriod = fixToCorrectPeriod(
        period.map((date: string) => new Date(date))
    ).map((date) =>
        convertDateToYYYYMMDD(new Date(date), '.')
    )

    navigate(`/period/${fixedPeriod[0]}-${fixedPeriod[1]}`)
}

import { NavigateFunction } from "react-router-dom";

import { convertDateToYYYYMMDD, fixToCorrectDate } from "logic/utils/dateConverter";

export const goToCorrectDate = (date: string, navigate: NavigateFunction) => {
    const fixedDate = convertDateToYYYYMMDD(fixToCorrectDate(new Date(date)), '-');
    navigate(`/date/${fixedDate}`)
}

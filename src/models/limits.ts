import { convertDateToYYYYMMDD, getTodayDate } from "logic/utils/dateConverter";

const LIMITS = {
    minDate: "1995-06-16",
    maxDate: convertDateToYYYYMMDD(getTodayDate(), '-'),
}

export default LIMITS;
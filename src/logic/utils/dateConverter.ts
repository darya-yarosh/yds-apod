export function convertDateToYYYYMMDD(date: Date, separator: string) {
    const year = date.getFullYear().toString();
    
    let month = (date.getMonth()+1).toString();
    if (month.length < 2) {
        month = `0${month}`;
    }

    let day = date.getDate().toString();
    if (day.length < 2) {
        day = `0${day}`;
    }

    return `${year}${separator}${month}${separator}${day}`;
}

export function getTodayDate(){
    let options = {timeZone: 'America/New_York'};
    let eastCoastTime = new Date().toLocaleString('en-US', options);
    return new Date(eastCoastTime);
}
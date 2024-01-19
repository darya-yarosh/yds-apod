import { DateInfo } from "models/dateInfo";

const USER_API_KEY = 'UHPJgePVbrUaaBOhRaDalhfpEGF0rMtEIOu0mjgb';

const API_CONTROLLER = {
    getDateData: async function getDateData(convertedDate: String) {
        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
        };

        const mainUrl = `https://api.nasa.gov/planetary/apod?`
        const apiKey = `api_key=${USER_API_KEY}`;
        const url = mainUrl + apiKey + `&date=${convertedDate}`;

        const apiUrl = await fetch(url, requestOptions);
        const data = await apiUrl.json();

        const dateData: DateInfo = {
            copyright: data.copyright,
            date: data.date,
            explanation: data.explanation,
            hdurl: data.hdurl,
            media_type: data.media_type,
            service_version: data.service_version,
            title: data.title,
            url: data.url
        }

        return dateData;
    },
    getPeriodData: async function getPeriodData(
        convertedStartDate: string,
        convertedEndDate: string
    ) {
        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
        };

        const mainUrl = `https://api.nasa.gov/planetary/apod?`
        const apiKey = `api_key=${USER_API_KEY}`;
        const url = mainUrl
            + apiKey
            + `&start_date=${convertedStartDate}`
            + `&end_date=${convertedEndDate}`
            + `&hd=false`;

        const apiUrl = await fetch(url, requestOptions);
        const dataList = await apiUrl.json();

        const dateDataList: DateInfo[] = dataList.map((data: any) => {
            const newData: DateInfo = {
                copyright: data.copyright,
                date: data.date,
                explanation: data.explanation,
                hdurl: data.hdurl,
                media_type: data.media_type,
                service_version: data.service_version,
                title: data.title,
                url: data.url
            }
            return newData;
        })

        return dateDataList;
    }
}

export default API_CONTROLLER


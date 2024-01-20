import { AstroPicData } from "models/astroPicData";

import {
    checkIsDateCorrect,
    checkIsPeriodCorrect,
    convertDateToYYYYMMDD
} from "logic/utils/dateConverter";

const USER_API_KEY = 'UHPJgePVbrUaaBOhRaDalhfpEGF0rMtEIOu0mjgb';

const API_CONTROLLER = {
    getDateData: async function getDateData(date: Date) {
        const isCorrectDate = checkIsDateCorrect(date)
        if (!isCorrectDate) {
            throw new Error('Invalid date');
        }

        const convertedDate = convertDateToYYYYMMDD((date), '-');

        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
        };

        const mainUrl = `https://api.nasa.gov/planetary/apod?`
        const apiKey = `api_key=${USER_API_KEY}`;
        const url = mainUrl + apiKey + `&date=${convertedDate}`;

        const apiUrl = await fetch(url, requestOptions);
        const data = await apiUrl.json();
        if (apiUrl.status === 400) {
            throw new Error('Invalid date');
        }
        const dateData: AstroPicData = {
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
        startDate: Date,
        endDate: Date
    ) {
        const isCorrectPeriod = checkIsPeriodCorrect([startDate, endDate])
        const convertedPeriod = [
            convertDateToYYYYMMDD(startDate, '-'),
            convertDateToYYYYMMDD(endDate, '-')
        ]
        if (!isCorrectPeriod) {
            throw new Error('Invalid period');
        }

        const requestOptions: RequestInit = {
            method: 'GET',
            redirect: 'follow',
        };

        const mainUrl = `https://api.nasa.gov/planetary/apod?`
        const apiKey = `api_key=${USER_API_KEY}`;
        const url = mainUrl
            + apiKey
            + `&start_date=${convertedPeriod[0]}`
            + `&end_date=${convertedPeriod[1]}`
            + `&hd=false`;

        const apiUrl = await fetch(url, requestOptions);
        const dataList = await apiUrl.json();

        const dateDataList: AstroPicData[] = dataList.map((data: any) => {
            const newData: AstroPicData = {
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


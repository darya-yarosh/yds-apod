import { describe, expect, test } from '@jest/globals';

import * as dateConverter from "logic/utils/dateConverter";

describe('Date converter Module', () => {
    test('Convert date to YYYYMMDD format with separator', () => {
        expect(dateConverter.convertDateToYYYYMMDD(new Date(2024, 0, 11), '-'))
            .toBe('2024-01-11');
        expect(dateConverter.convertDateToYYYYMMDD(new Date(2024, 0, 11), '.'))
            .toBe('2024.01.11');
        expect(dateConverter.convertDateToYYYYMMDD(new Date(2024, 0, 2), '.'))
            .toBe('2024.01.02');
    });

    test('Get today date in America UTC', () => {
        const todayDate = new Date(new Date().getTime() - 7 * 60 * 60 * 1000)
        const convertedTodayDate = dateConverter.convertDateToYYYYMMDD(todayDate, '.')

        expect(
            dateConverter.convertDateToYYYYMMDD(
                dateConverter.getTodayDate(), '.'
            )
        )
            .toBe(convertedTodayDate);
    });
});
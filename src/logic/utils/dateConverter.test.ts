import { describe, expect, test } from '@jest/globals';

import LIMITS from 'models/limits';

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

    test('Get today date with America UTC', () => {
        const todayDate = new Date(
            new Date()
                .getTime() - 7 * 60 * 60 * 1000
        )
        const convertedTodayDate = dateConverter.convertDateToYYYYMMDD(todayDate, '.')

        expect(dateConverter.convertDateToYYYYMMDD(
            dateConverter.getTodayUTCDate(), '.'
        )).toBe(convertedTodayDate);
    });

    test('Check is date correct', () => {
        const tomorrowDate = new Date(
            new Date()
                .getTime() + 1 * 24 * 60 * 60 * 1000
        )

        expect(dateConverter.checkIsDateCorrect(dateConverter.getTodayUTCDate()))
            .toBe(true);

        expect(dateConverter.checkIsDateCorrect(tomorrowDate))
            .toBe(false);
    });

    test('Fix date to correct limits', () => {
        const tomorrowAfterMinLimitDate = new Date(
            LIMITS.minDate
                .getTime() - 1 * 24 * 60 * 60 * 1000
        )
        const tomorrowDate = new Date(
            new Date()
                .getTime() + 1 * 24 * 60 * 60 * 1000
        )
        const todayDate = dateConverter.getTodayUTCDate();

        expect(dateConverter.fixToCorrectDate(tomorrowAfterMinLimitDate))
            .toBe(LIMITS.minDate);

        expect(dateConverter.fixToCorrectDate(todayDate))
            .toBe(todayDate);

        expect(dateConverter.fixToCorrectDate(tomorrowDate))
            .toBe(LIMITS.maxDate);
    });

    test('Check is period correct', () => {
        const todayDate = dateConverter.getTodayUTCDate();
        const tomorrowDate = new Date(
            new Date()
                .getTime() + 1 * 24 * 60 * 60 * 1000
        )

        expect(dateConverter.checkIsPeriodCorrect([
            todayDate,
            tomorrowDate
        ])).toBe(false);

        expect(dateConverter.checkIsPeriodCorrect([
            todayDate,
            todayDate
        ])).toBe(true);

        expect(dateConverter.checkIsPeriodCorrect([
            LIMITS.minDate,
            LIMITS.maxDate
        ])).toBe(true);

        expect(dateConverter.checkIsPeriodCorrect([
            LIMITS.maxDate,
            LIMITS.minDate
        ])).toBe(false);
    });

    test('Fix period to correct limits', () => {
        const todayDate = dateConverter.getTodayUTCDate();
        const tomorrowDate = new Date(
            new Date()
                .getTime() + 1 * 24 * 60 * 60 * 1000
        )

        expect(dateConverter.fixToCorrectPeriod([
            todayDate,
            tomorrowDate
        ])).toEqual([
            todayDate,
            LIMITS.maxDate
        ]);

        expect(dateConverter.fixToCorrectPeriod([
            todayDate,
            todayDate
        ])).toEqual([
            todayDate,
            todayDate
        ]);

        expect(dateConverter.fixToCorrectPeriod([
            LIMITS.minDate,
            LIMITS.maxDate
        ])).toEqual([
            LIMITS.minDate,
            LIMITS.maxDate
        ]);

        expect(dateConverter.fixToCorrectPeriod([
            LIMITS.maxDate,
            LIMITS.minDate
        ])).toEqual([
            LIMITS.minDate,
            LIMITS.maxDate
        ]);
    });
});
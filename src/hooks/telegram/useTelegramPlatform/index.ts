import { useState, useEffect } from 'react';
import { isTMA, retrieveLaunchParams } from '@telegram-apps/sdk';

import { TUseTelegramPlatform } from './types';

// Хук для платформы
export const useTelegramPlatform: TUseTelegramPlatform = () => {
    const [platform, setPlatform] = useState<string>('unknown');

    useEffect(() => {
        if (isTMA()) {
            const { tgWebAppData: initData } = retrieveLaunchParams();

            const currentPlatform = (initData as any)?.platform || "unknown";
            setPlatform(currentPlatform);
        }
    }, []);

    return platform;
};
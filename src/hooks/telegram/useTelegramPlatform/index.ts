import { useState, useEffect } from 'react';
import { init, isTMA } from '@telegram-apps/sdk';

import { TUseTelegramPlatform } from './types';

// Хук для платформы
export const useTelegramPlatform: TUseTelegramPlatform = () => {
    const [platform, setPlatform] = useState<string>('unknown');

    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            setPlatform(tg.platform);
        }
    }, []);

    return platform;
};
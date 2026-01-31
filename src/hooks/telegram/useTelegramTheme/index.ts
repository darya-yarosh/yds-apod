import { useState, useEffect } from 'react';
import { init, isTMA } from '@telegram-apps/sdk';

import { ITelegramThemeParams } from 'models/telegram';

import { TUseTelegramTheme } from './types';

export const useTelegramTheme: TUseTelegramTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [themeParams, setThemeParams] = useState<ITelegramThemeParams>({
        bg_color: '#ffffff',
        text_color: '#000000',
        hint_color: '#999999',
        link_color: '#2481cc',
        button_color: '#2481cc',
        button_text_color: '#ffffff',
        secondary_bg_color: '#f2f2f7',
    });

    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            if (tg.themeParams) {
                const currentTheme = tg.colorScheme;
                setTheme(currentTheme);
                setThemeParams(tg.themeParams);
                
                // Слушаем изменения темы
                tg.onEvent('themeChanged', () => {
                    setTheme(tg.colorScheme);
                    setThemeParams(tg.themeParams);
                });
            }
        }
    }, []);

    return { theme, themeParams };
};
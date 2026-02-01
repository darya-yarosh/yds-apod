import { useState, useEffect } from 'react';
import { themeParams, isTMA } from '@telegram-apps/sdk';

import { ITelegramThemeParams, TUseTelegramTheme } from './types';

export const useTelegramTheme: TUseTelegramTheme = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [themeParamsState, setThemeParamsState] = useState<ITelegramThemeParams>({
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
            const currentTheme = themeParams;
            if (!currentTheme) {
                return;
            }

            setTheme(currentTheme.isDark() ? 'dark' : 'light');

            setThemeParamsState((current) => {
                return {
                    bg_color: currentTheme.backgroundColor() || current.bg_color,
                    text_color: currentTheme.textColor() || current.text_color,
                    hint_color: currentTheme.hintColor() || current.hint_color,
                    link_color: currentTheme.linkColor() || current.link_color,
                    button_color: currentTheme.buttonColor() || current.button_color,
                    button_text_color: currentTheme.buttonTextColor() || current.button_text_color,
                    secondary_bg_color: currentTheme.secondaryBackgroundColor() || current.secondary_bg_color,
                };
            });
        }
    }, []);

    return { theme, themeParams: themeParamsState };
};
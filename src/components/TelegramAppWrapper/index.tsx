// src/components/TelegramAppWrapper.jsx
import React, { useEffect } from 'react';

import { themeParams } from '@telegram-apps/sdk';
import { useTelegram } from 'components/TelegramProvider';
import { TTelegramAppWrapper } from './types';

const TelegramAppWrapper: TTelegramAppWrapper = ({ children }) => {
    const { isReady, isTMA } = useTelegram() as any;
    const [theme, setTheme] = React.useState('light');

    useEffect(() => {
        if (isTMA && isReady) {
            // Настройка темы
            const tgThemeParams = themeParams as any;
            if (tgThemeParams.isSupported()) {
                const currentTheme = tgThemeParams.get();
                setTheme(currentTheme.isDark ? 'dark' : 'light');
                
                // Подписываемся на изменения темы
                tgThemeParams.on('change', (newTheme: any) => {
                    setTheme(newTheme.isDark ? 'dark' : 'light');
                });
            }
        }
    }, [isTMA, isReady]);

    // Применяем стили в зависимости от темы
    useEffect(() => {
        if (isTMA) {
            document.body.classList.toggle('dark-theme', theme === 'dark');
            document.body.classList.toggle('light-theme', theme === 'light');
        }
    }, [theme, isTMA]);

    if (isTMA && !isReady) {
        return (
            <div className="telegram-loading">
                <div>Загрузка Telegram Mini App...</div>
            </div>
        );
    }

    return (
        <div className={`telegram-app ${theme}-theme`}>
            {children}
        </div>
    );
};

export default TelegramAppWrapper;
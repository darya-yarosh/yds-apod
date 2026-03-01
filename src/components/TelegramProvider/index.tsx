import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { init, isTMA, User, InitData, retrieveLaunchParams,  } from '@telegram-apps/sdk';

import { useTelegramUser } from 'hooks/telegram/useTelegramUser';
import { useTelegramTheme } from 'hooks/telegram/useTelegramTheme';

interface TelegramContextType {
    telegram: InitData | null;
    user: User | null;
    isReady: boolean;
    isTMA: boolean;
}

const TelegramContext = createContext<TelegramContextType>({
    telegram: null,
    user: null,
    isReady: false,
    isTMA: false,
});

interface TelegramProviderProps {
    children: ReactNode;
}

export const TelegramProvider: React.FC<TelegramProviderProps> = ({ children }) => {
    /**
     * State
     */
    const [telegram, setTelegram] = useState<InitData | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [isReady, setIsReady] = useState(false);

    const isTMAstate = isTMA();
    const [errMsg, setErrMsg] = useState("");

    const userData = useTelegramUser();
    const { theme, themeParams } = useTelegramTheme();
    // useTelegramBackButton(() => window.history.back());
    // useTelegramViewport();

    /**
     * Handlers
     */
    const applyTelegramTheme = useCallback((needApply: boolean) => {
        if (!needApply) {
            return;
        }

        if (!theme) {
            return;
        }
        
        const root = document.documentElement;

        if (!themeParams) {
            return;
        }
        
        // Устанавливаем CSS переменные из themeParams
        root.style.setProperty('--tg-theme-bg-color', themeParams.bg_color);
        root.style.setProperty('--tg-theme-text-color', themeParams.text_color);
        root.style.setProperty('--tg-theme-hint-color', themeParams.hint_color);
        root.style.setProperty('--tg-theme-link-color', themeParams.link_color);
        root.style.setProperty('--tg-theme-button-color', themeParams.button_color);
        root.style.setProperty('--tg-theme-button-text-color', themeParams.button_text_color);
        root.style.setProperty('--tg-theme-secondary-bg-color', themeParams.secondary_bg_color);
        
        if (!theme) {
            return;
        }

        // Также добавляем переменные для isDark
        root.style.setProperty('--tg-theme-is-dark', theme === "dark" ? '1' : '0');
        
        // Устанавливаем класс темы на body
        document.body.classList.toggle('tg-theme-dark', theme === "dark" );
        document.body.classList.toggle('tg-theme-light', theme === "light");
    }, [theme, themeParams]);

    const handleInit = useCallback(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (!isTMAstate) {
            return;
        }

        try {
            // Инициализация SDK
            init();

            const { tgWebAppData: initData } = retrieveLaunchParams();
            
            // Сохраняем объект для совместимости
            if (!telegram) {
                setTelegram(initData as InitData);
                setErrMsg((current) => `${current}+init tg`);
            }
            
            // Получаем данные пользователя
            if (!user) {
                setUser(userData);
                setErrMsg((current) => `${current}+init user`);
            }
            
            // Альтернативно: ручная установка CSS переменных
            applyTelegramTheme(false);
            setErrMsg((current) => `${current}+init theme`);
            
            setIsReady(true);
            setErrMsg((current) => `${current}+init ready`);
        } catch (error) {
            setErrMsg((current) => `${current}+SDK error: ${error}`);
            console.error('Error initializing Telegram SDK:', error);
        }
    }, [isTMAstate, telegram, user, userData, applyTelegramTheme]);

    useEffect(() => {
        handleInit()
    }, [handleInit]);


    const value: TelegramContextType = useMemo(() => {
        return {
            telegram,
            user,
            isReady,
            isTMA: isTMAstate,
        };
    }, [isReady, telegram, user, isTMAstate]);

    return (
        <TelegramContext.Provider value={value}>
            {children}
        </TelegramContext.Provider>
    );
};

export const useTelegram = (): TelegramContextType => {
    const context = useContext(TelegramContext);

    if (!context) {
        throw new Error('useTelegram must be used within TelegramProvider');
    }
    return {
        ...context,
    };
};
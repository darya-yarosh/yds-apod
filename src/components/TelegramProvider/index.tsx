// src/contexts/TelegramContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { init, isTMA } from '@telegram-apps/sdk';
import { ITelegramWebApp, ITelegramUser } from "../../models/telegram";

interface TelegramContextType {
    telegram: ITelegramWebApp | null;
    user: ITelegramUser | null;
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
    const [telegram, setTelegram] = useState<ITelegramWebApp | null>(null);
    const [user, setUser] = useState<ITelegramUser | null>(null);
    const [isReady, setIsReady] = useState(false);

    const isTMAstate = isTMA();
    const [errMsg, setErrMsg] = useState("");

    /**
     * Handlers
     */
    // Функция применения темы
    const applyTelegramTheme = useCallback((tg: ITelegramWebApp) => {
        const root = document.documentElement;
        
        // Устанавливаем CSS переменные
        root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
        root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
        root.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
        root.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color);
        root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
        root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
        root.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color);
    }, []);

    const handleInit = useCallback(() => {
        if (!window) {
            setErrMsg("window not");
            return;
        }

        if (!isTMAstate) {
            setErrMsg("isTMAstate not");
            return;
        }

        if (telegram) {
            setErrMsg("telegram yes");
            return;
        }

        try {
            // Инициализация SDK - теперь получаем весь объект
            const tg = init();
            setTelegram(tg);
            setErrMsg((current) => `${current}+${"init tg"}`);
            
            // Получаем данные пользователя
            const userData = tg.initDataUnsafe?.user || null;
            setUser(userData);
            setErrMsg((current) => `${current}+${"init user"}`);
            
            // Настройка кнопки "Назад" - теперь через tg.BackButton
            if (tg.BackButton) {
                tg.BackButton.show();
                tg.BackButton.onClick(() => {
                    window.history.back();
                });
                setErrMsg((current) => `${current}+${"init btn"}`);
            }
            
            // В новой версии viewport управляется автоматически
            // Просто расширяем на весь экран
            tg.expand();
            setErrMsg((current) => `${current}+${"init expand"}`);
            
            // Устанавливаем CSS переменные для темы
            applyTelegramTheme(tg);
            setErrMsg((current) => `${current}+${"init theme"}`);
            
            setIsReady(true);
            setErrMsg((current) => `${current}+${"init ready"}`);
            
            // Очистка при размонтировании
            return () => {
                setErrMsg((current) => `${current}+${"MONTIR"}`);
                if (tg.BackButton) {
                    tg.BackButton.hide();
                    tg.BackButton.offClick(() => {});
                }
            };
        } catch (error) {
            setErrMsg((current) => `${current}+${"SDKerror!:"}:${error}`);
            console.error('Error initializing Telegram SDK:', error);
        }
    }, [isTMAstate, telegram, applyTelegramTheme]);

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
            <div style={{"color": "white", "backgroundColor": "black", "display": "flex", "flexDirection": "row", "width": "100%"}}>
                <span>{"tgProvider"}</span>
                <span>{`${Boolean(telegram)}`}</span>
                <span>{`${Boolean(user)}`}</span>
                <span>{`${Boolean(isReady)}`}</span>
                <span>{`${Boolean(window)}`}</span>
                <span>{`${isTMAstate}`}</span>
                <span>{errMsg}</span>
            </div>
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
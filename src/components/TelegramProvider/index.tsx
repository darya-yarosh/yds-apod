// src/contexts/TelegramContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback, useMemo } from 'react';
import { init, isTMA, viewport, backButton, User, InitData, themeParams,  } from '@telegram-apps/sdk';
// import { ITelegramWebApp, ITelegramUser } from "../../models/telegram";
import { useTelegramUser } from 'hooks/telegram/useTelegramUser';

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

    /**
     * Handlers
     */
    const applyTelegramTheme = useCallback(() => {
        if (!themeParams) return;
        
        const root = document.documentElement;
        const currentTheme = (themeParams as any).get();
        
        // Устанавливаем CSS переменные из themeParams
        root.style.setProperty('--tg-theme-bg-color', currentTheme.bgColor);
        root.style.setProperty('--tg-theme-text-color', currentTheme.textColor);
        root.style.setProperty('--tg-theme-hint-color', currentTheme.hintColor);
        root.style.setProperty('--tg-theme-link-color', currentTheme.linkColor);
        root.style.setProperty('--tg-theme-button-color', currentTheme.buttonColor);
        root.style.setProperty('--tg-theme-button-text-color', currentTheme.buttonTextColor);
        root.style.setProperty('--tg-theme-secondary-bg-color', currentTheme.secondaryBgColor);
        
        // Также добавляем переменные для isDark
        root.style.setProperty('--tg-theme-is-dark', currentTheme.isDark ? '1' : '0');
        
        // Устанавливаем класс темы на body
        document.body.classList.toggle('tg-theme-dark', currentTheme.isDark);
        document.body.classList.toggle('tg-theme-light', !currentTheme.isDark);
    }, []);

    const handleInit = useCallback(() => {
        if (typeof window === 'undefined') {
            setErrMsg("window not defined");
            return;
        }

        if (!isTMAstate) {
            setErrMsg("isTMAstate false");
            return;
        }

        if (telegram) {
            setErrMsg("telegram already initialized");
            return;
        }

        try {
            // Вариант 1: Используем новую версию SDK (@telegram-apps/sdk)
            const tg = init();
            
            // Сохраняем объект для совместимости
            setTelegram(tg as unknown as InitData);
            setErrMsg((current) => `${current}+init tg`);
            
            // Получаем данные пользователя
            setUser(userData);
            setErrMsg((current) => `${current}+init user`);
            
            // Настройка кнопки "Назад" через отдельный модуль
            if (backButton.isSupported()) {
                backButton.show();
                backButton.onClick(() => {
                    window.history.back();
                });
                setErrMsg((current) => `${current}+init backButton`);
            }
            
            // Расширяем viewport через отдельный модуль
            if (viewport) {
                viewport.expand(); // ВОТ ПРАВИЛЬНЫЙ ВЫЗОВ!
                viewport.bindCssVars(); // Автоматически устанавливает CSS переменные
                setErrMsg((current) => `${current}+init viewport`);
            }
            
            // Альтернативно: ручная установка CSS переменных
            applyTelegramTheme();
            setErrMsg((current) => `${current}+init theme`);
            
            setIsReady(true);
            setErrMsg((current) => `${current}+init ready`);
            
        } catch (error) {
            setErrMsg((current) => `${current}+SDK error: ${error}`);
            console.error('Error initializing Telegram SDK:', error);
        }
    }, [isTMAstate, telegram, userData, applyTelegramTheme]);

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
                <span>{`telegram: ${Boolean(telegram)}`}</span>
                <span>{`user: ${Boolean(user)}`}</span>
                <span>{`ready: ${isReady}`}</span>
                <span>{`window: ${typeof window !== 'undefined'}`}</span>
                <span>{`isTMA: ${isTMAstate}`}</span>
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
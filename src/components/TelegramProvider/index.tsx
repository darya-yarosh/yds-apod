// src/contexts/TelegramContext.tsx
import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
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
    const [telegram, setTelegram] = useState<ITelegramWebApp | null>(null);
    const [user, setUser] = useState<ITelegramUser | null>(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined' && isTMA()) {
            try {
                // Инициализация SDK - теперь получаем весь объект
                const tg = init();
                setTelegram(tg);
                
                // Получаем данные пользователя
                const userData = tg.initDataUnsafe?.user || null;
                setUser(userData);
                
                // Настройка кнопки "Назад" - теперь через tg.BackButton
                if (tg.BackButton) {
                    tg.BackButton.show();
                    tg.BackButton.onClick(() => {
                        window.history.back();
                    });
                }
                
                // В новой версии viewport управляется автоматически
                // Просто расширяем на весь экран
                tg.expand();
                
                // Устанавливаем CSS переменные для темы
                applyTelegramTheme(tg);
                
                setIsReady(true);
                
                // Очистка при размонтировании
                return () => {
                    if (tg.BackButton) {
                        tg.BackButton.hide();
                        tg.BackButton.offClick(() => {});
                    }
                };
            } catch (error) {
                console.error('Error initializing Telegram SDK:', error);
            }
        }
    }, []);

    // Функция применения темы
    const applyTelegramTheme = (tg: ITelegramWebApp) => {
        const root = document.documentElement;
        
        // Устанавливаем CSS переменные
        root.style.setProperty('--tg-theme-bg-color', tg.themeParams.bg_color);
        root.style.setProperty('--tg-theme-text-color', tg.themeParams.text_color);
        root.style.setProperty('--tg-theme-hint-color', tg.themeParams.hint_color);
        root.style.setProperty('--tg-theme-link-color', tg.themeParams.link_color);
        root.style.setProperty('--tg-theme-button-color', tg.themeParams.button_color);
        root.style.setProperty('--tg-theme-button-text-color', tg.themeParams.button_text_color);
        root.style.setProperty('--tg-theme-secondary-bg-color', tg.themeParams.secondary_bg_color);
    };

    const value: TelegramContextType = {
        telegram,
        user,
        isReady,
        isTMA: isTMA(),
    };

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
// src/hooks/useTelegramHooks.ts
import { useState, useEffect, useCallback } from 'react';
import { init, isTMA } from '@telegram-apps/sdk';
import { ITelegramUser, ITelegramThemeParams, ITelegramMainButton } from  "../../models/telegram";

// Хук для работы с пользователем
export const useTelegramUser = (): ITelegramUser | null => {
    const [user, setUser] = useState<ITelegramUser | null>(null);

    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            const userData = tg.initDataUnsafe?.user;
            if (userData) {
                setUser(userData);
            }
        }
    }, []);

    return user;
};

// Типы для кнопки
interface MainButtonOptions {
    text?: string;
    color?: string;
    textColor?: string;
    isActive?: boolean;
    isVisible?: boolean;
    onClick?: () => void;
}

// Хук для главной кнопки - теперь используем tg.MainButton
export const useTelegramMainButton = (options: MainButtonOptions = {}): void => {
    const {
        text = 'Продолжить',
        color,
        textColor,
        isActive = true,
        isVisible = true,
        onClick
    } = options;

    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            
            if (tg.MainButton) {
                tg.MainButton.setText(text);
                
                if (color || textColor) {
                    tg.MainButton.setParams({
                        color: color || undefined,
                        text_color: textColor || undefined
                    });
                }

                if (isActive) {
                    tg.MainButton.enable();
                } else {
                    tg.MainButton.disable();
                }

                if (isVisible) {
                    tg.MainButton.show();
                } else {
                    tg.MainButton.hide();
                }

                if (onClick) {
                    tg.MainButton.onClick(onClick);
                }

                return () => {
                    if (onClick) {
                        tg.MainButton.offClick(onClick);
                    }
                    tg.MainButton.hide();
                };
            }
        }
    }, [text, color, textColor, isActive, isVisible, onClick]);
};

// Хук для кнопки "Назад"
export const useTelegramBackButton = (onClick?: () => void): void => {
    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            
            if (tg.BackButton) {
                tg.BackButton.show();
                
                const handleClick = () => {
                    if (onClick) {
                        onClick();
                    } else {
                        window.history.back();
                    }
                };
                
                tg.BackButton.onClick(handleClick);
                
                return () => {
                    tg.BackButton.offClick(handleClick);
                    tg.BackButton.hide();
                };
            }
        }
    }, [onClick]);
};

// Хук для темы
interface ThemeHookResult {
    theme: 'light' | 'dark';
    themeParams: ITelegramThemeParams;
}

export const useTelegramTheme = (): ThemeHookResult => {
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

// Хук для отправки данных
interface SendDataHookResult {
    sendData: (data: unknown) => boolean;
    closeApp: () => void;
    showAlert: (message: string) => void;
    showPopup: (params: {
        title?: string;
        message: string;
        buttons?: Array<{
            id?: string;
            type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
        }>;
    }) => Promise<string | undefined>;
}

export const useTelegramSendData = (): SendDataHookResult => {
    const sendData = useCallback((data: unknown): boolean => {
        if (isTMA()) {
            const tg = init();
            try {
                tg.sendData(JSON.stringify(data));
                return true;
            } catch (error) {
                console.error('Error sending data:', error);
                return false;
            }
        }
        return false;
    }, []);

    const closeApp = useCallback((): void => {
        if (isTMA()) {
            const tg = init();
            tg.close();
        }
    }, []);

    const showAlert = useCallback((message: string): void => {
        if (isTMA()) {
            const tg = init();
            tg.showAlert(message);
        }
    }, []);

    const showPopup = useCallback(async (params: {
        title?: string;
        message: string;
        buttons?: Array<{
            id?: string;
            type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
        }>;
    }): Promise<string | undefined> => {
        if (isTMA()) {
            const tg = init();
            return new Promise((resolve) => {
                tg.showPopup(params, (buttonId: string) => {
                    resolve(buttonId);
                });
            });
        }
    }, []);

    return { sendData, closeApp, showAlert, showPopup };
};

// Хук для платформы
export const useTelegramPlatform = (): string => {
    const [platform, setPlatform] = useState<string>('unknown');

    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            setPlatform(tg.platform);
        }
    }, []);

    return platform;
};

// Хук для viewport
interface ViewportHookResult {
    height: number;
    stableHeight: number;
    isExpanded: boolean;
}

export const useTelegramViewport = (): ViewportHookResult => {
    const [viewportState, setViewportState] = useState<ViewportHookResult>({
        height: 0,
        stableHeight: 0,
        isExpanded: false,
    });

    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            
            const updateViewport = () => {
                setViewportState({
                    height: tg.viewportHeight,
                    stableHeight: tg.viewportStableHeight,
                    isExpanded: tg.isExpanded,
                });
            };
            
            updateViewport();
            
            // Слушаем изменения viewport
            tg.onEvent('viewportChanged', updateViewport);
            
            return () => {
                tg.offEvent('viewportChanged', updateViewport);
            };
        }
    }, []);

    return viewportState;
};

// Хук для облачного хранилища
export const useTelegramCloudStorage = () => {
    const [storage, setStorage] = useState<any>(null);

    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            if (tg.CloudStorage) {
                setStorage(tg.CloudStorage);
            }
        }
    }, []);

    const setItem = useCallback(async (key: string, value: string): Promise<void> => {
        if (isTMA()) {
            const tg = init();
            if (tg.CloudStorage) {
                await tg.CloudStorage.setItem(key, value);
            }
        }
    }, []);

    const getItem = useCallback(async (key: string): Promise<string | null> => {
        if (isTMA()) {
            const tg = init();
            if (tg.CloudStorage) {
                return await tg.CloudStorage.getItem(key);
            }
        }
        return null;
    }, []);

    const removeItem = useCallback(async (key: string): Promise<void> => {
        if (isTMA()) {
            const tg = init();
            if (tg.CloudStorage) {
                await tg.CloudStorage.removeItem(key);
            }
        }
    }, []);

    return {
        storage,
        setItem,
        getItem,
        removeItem
    };
};
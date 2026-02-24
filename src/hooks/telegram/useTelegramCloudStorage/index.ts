import { useState, useEffect, useCallback } from 'react';
import { cloudStorage, isTMA } from '@telegram-apps/sdk';

import { TUseTelegramCloudStorage } from './types';

// Хук для облачного хранилища
export const useTelegramCloudStorage: TUseTelegramCloudStorage = () => {
    const [storage, setStorage] = useState<any>(null);

    useEffect(() => {
        if (isTMA()) {
            const windowCloudStorage = (window as any)?.Telegram?.WebApp?.CloudStorage;
            if (cloudStorage) {
                setStorage(cloudStorage);
            } else if (windowCloudStorage) {
                setStorage(windowCloudStorage)
            }
        }
    }, []);

    const setItem = useCallback(async (key: string, value: string): Promise<void> => {
        if (storage) {
            await storage.setItem(key, value);
        }
    }, [storage]);

    const getItem = useCallback(async (key: string): Promise<string | null> => {
        if (storage) {
            return await storage.getItem(key);
        }
        return null;
    }, [storage]);

    const removeItem = useCallback(async (key: string): Promise<void> => {
        if (storage) {
            await storage.deleteItem(key);
        }
    }, [storage]);

    return {
        storage,
        setItem,
        getItem,
        removeItem
    };
};
import { useState, useEffect, useCallback } from 'react';
import { init, isTMA } from '@telegram-apps/sdk';

import { TUseTelegramCloudStorage } from './types';

// Хук для облачного хранилища
export const useTelegramCloudStorage: TUseTelegramCloudStorage = () => {
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
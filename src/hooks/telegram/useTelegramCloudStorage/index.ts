import { useState, useEffect, useCallback } from 'react';
import { cloudStorage, isTMA } from '@telegram-apps/sdk';

import { TUseTelegramCloudStorage } from './types';

// Хук для облачного хранилища
export const useTelegramCloudStorage: TUseTelegramCloudStorage = () => {
    const [storage, setStorage] = useState<any>(null);

    useEffect(() => {
        if (isTMA()) {
            if (cloudStorage) {
                setStorage(cloudStorage);
            }
        }
    }, []);

    const setItem = useCallback(async (key: string, value: string): Promise<void> => {
        if (isTMA()) {
            if (cloudStorage) {
                await cloudStorage.setItem(key, value);
            }
        }
    }, []);

    const getItem = useCallback(async (key: string): Promise<string | null> => {
        if (isTMA()) {
            if (cloudStorage) {
                return await cloudStorage.getItem(key);
            }
        }
        return null;
    }, []);

    const removeItem = useCallback(async (key: string): Promise<void> => {
        if (isTMA() && cloudStorage.isSupported()) {
            if (cloudStorage) {
                await cloudStorage.deleteItem(key);
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
import { cloudStorage, isTMA } from "@telegram-apps/sdk";
import { useCallback, useEffect, useState } from "react";

import { TFavorites, TUseFavoritesData } from "./types";
import { FAVORITES_KEY } from "./constants";

// Хук для получения списка избранных записей
export const useFavoritesData: TUseFavoritesData = () => {

    const [favorites, setFavorites] = useState<TFavorites>(null);

    const fetchFavorites = useCallback(async () => {
        if (cloudStorage.isSupported()) {
            const dataFromStorage = await cloudStorage.getItem(FAVORITES_KEY);

            if (!dataFromStorage) {
                return;
            }

            setFavorites(JSON.parse(dataFromStorage));
        }
    }, []);

    const updateFavorites = useCallback(async (newData: TFavorites) => {
        if (cloudStorage.isSupported()) {
            await cloudStorage.setItem(FAVORITES_KEY, JSON.stringify(newData));
            setFavorites(newData);
        }
    }, []);

    useEffect(() => {
        if (isTMA()) {
            fetchFavorites()
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        favorites,
        fetch: fetchFavorites,
        update: updateFavorites,
    };
};
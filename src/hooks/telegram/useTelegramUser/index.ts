import { isTMA, retrieveLaunchParams } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";

import { TelegramUser, TUseTelegramUser } from "./types";

// Хук для работы с пользователем
export const useTelegramUser: TUseTelegramUser = () => {
    const [user, setUser] = useState<TelegramUser>(null);

    useEffect(() => {
        try {
            const { tgWebAppData: initData } = retrieveLaunchParams();
            if (isTMA() && initData) {
                const userData = initData?.user;
                if (userData) {
                    setUser(userData);
                }
            }
        } catch {}
    }, []);

    return user;
};
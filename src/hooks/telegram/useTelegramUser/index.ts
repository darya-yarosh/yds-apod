import { isTMA, initDataUser } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";

import { TelegramUser, TUseTelegramUser } from "./types";

// Хук для работы с пользователем
export const useTelegramUser: TUseTelegramUser = () => {
    const [user, setUser] = useState<TelegramUser>(null);

    useEffect(() => {
        try {
            if (isTMA()) {
                const userData = initDataUser();
                if (userData) {
                    setUser(userData);
                }
            }
        } catch {}
    }, []);

    return user;
};
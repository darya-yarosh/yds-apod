import { init, isTMA } from "@telegram-apps/sdk";
import { useEffect, useState } from "react";

import { TelegramUser, TUseTelegramUser } from "./types";

// Хук для работы с пользователем
export const useTelegramUser: TUseTelegramUser = () => {
    const [user, setUser] = useState<TelegramUser>(null);

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
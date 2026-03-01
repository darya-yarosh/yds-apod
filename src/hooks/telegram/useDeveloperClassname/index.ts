import { useMemo } from "react";

import { useTelegramUser } from "../useTelegramUser";

export const useDeveloperClassName = () => {
    const TGUserInfo = useTelegramUser();
    
    const isUserDeveloper = useMemo(() => {
        if (!TGUserInfo) {
            return false;
        }  

        return TGUserInfo?.username === "GurimuSagi";
    }, [TGUserInfo]);

    const developerClassName = useMemo(() => {
        return !isUserDeveloper ? "forDeveloper" : "";
    }, [isUserDeveloper]);

    return developerClassName;
};
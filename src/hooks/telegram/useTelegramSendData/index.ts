import { useCallback } from 'react';
import { init, isTMA } from '@telegram-apps/sdk';

import { TUseTelegramSendData } from './types';

export const useTelegramSendData: TUseTelegramSendData = () => {
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
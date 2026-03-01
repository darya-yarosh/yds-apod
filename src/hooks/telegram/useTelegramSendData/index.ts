import { useCallback } from 'react';
import { 
    isTMA, 
    sendData,
    closeMiniApp,
    popup,  // для showPopup и showPopupError
    hapticFeedback // опционально для обратной связи
} from '@telegram-apps/sdk';

import { TUseTelegramSendData } from './types';

export const useTelegramSendData: TUseTelegramSendData = () => {
    const handleSendData = useCallback((data: unknown): boolean => {
        if (isTMA() && sendData.isSupported()) {
            try {
                sendData(JSON.stringify(data));
                hapticFeedback.notificationOccurred('success'); // опционально
                return true;
            } catch (error) {
                console.error('Error sending data:', error);
                return false;
            }
        }
        return false;
    }, []);

    const closeApp = useCallback((): void => {
        if (isTMA() && closeMiniApp) {
            closeMiniApp();
        }
    }, []);

    const showAlert = useCallback((message: string): void => {
        if (isTMA() && popup.isSupported()) {
            try {
                popup.show({
                    message,
                    buttons: [{ type: 'ok', id: 'ok' }]
                });
            } catch {}
        } else {
            // Фолбэк для web
            window.alert(message);
        }
    }, []);

    const handleShowPopup = useCallback(async (params: {
        title?: string;
        message: string;
        buttons?: Array<{
            id?: string;
            type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
        }>;
    }): Promise<string | undefined> => {
        if (isTMA() && popup.isSupported()) {
            try {
                popup.show(params);
            } catch {}
        }
        
        // Фолбэк для web
        const result = window.confirm(params.message);
        return result ? 'ok' : 'cancel';
    }, []);

    return { 
        sendData: handleSendData, 
        closeApp, 
        showAlert, 
        showPopup: handleShowPopup 
    };
};
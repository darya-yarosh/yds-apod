export type TUseTelegramSendData = () => SendDataHookResult;

// Хук для отправки данных
interface SendDataHookResult {
    sendData: (data: unknown) => boolean;
    closeApp: () => void;
    showAlert: (message: string) => void;
    showPopup: (params: {
        title?: string;
        message: string;
        buttons?: Array<{
            id?: string;
            type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
        }>;
    }) => Promise<string | undefined>;
}
// // src/types/telegram.d.ts
// export {};

// declare global {
//     interface Window {
//         Telegram?: {
//             WebApp: ITelegramWebApp;
//         };
//     }
// }

// export interface ITelegramUser {
//     id: number;
//     first_name: string;
//     last_name?: string;
//     username?: string;
//     language_code: string;
//     is_premium?: boolean;
//     photo_url?: string;
//     allows_write_to_pm?: boolean;
//     added_to_attachment_menu?: boolean;
// }

// export interface ITelegramChat {
//     id: number;
//     type: 'group' | 'supergroup' | 'channel';
//     title: string;
//     username?: string;
//     photo_url?: string;
// }

// export interface ITelegramInitData {
//     query_id?: string;
//     user?: ITelegramUser;
//     receiver?: ITelegramUser;
//     chat?: ITelegramChat;
//     chat_type?: string;
//     chat_instance?: string;
//     start_param?: string;
//     can_send_after?: number;
//     auth_date: number;
//     hash: string;
// }

// export interface ITelegramThemeParams {
//     bg_color: string;
//     text_color: string;
//     hint_color: string;
//     link_color: string;
//     button_color: string;
//     button_text_color: string;
//     secondary_bg_color: string;
// }

// export interface ITelegramMainButton {
//     text: string;
//     color: string;
//     textColor: string;
//     isVisible: boolean;
//     isActive: boolean;
//     isProgressVisible: boolean;
//     setText: (text: string) => void;
//     onClick: (callback: () => void) => void;
//     offClick: (callback: () => void) => void;
//     show: () => void;
//     hide: () => void;
//     enable: () => void;
//     disable: () => void;
//     showProgress: (leaveActive?: boolean) => void;
//     hideProgress: () => void;
//     setParams: (params: {
//         text?: string;
//         color?: string;
//         text_color?: string;
//         is_active?: boolean;
//         is_visible?: boolean;
//     }) => void;
// }

// export interface ITelegramBackButton {
//     isVisible: boolean;
//     show: () => void;
//     hide: () => void;
//     onClick: (callback: () => void) => void;
//     offClick: (callback: () => void) => void;
// }

// export interface ITelegramHapticFeedback {
//     impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
//     notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
//     selectionChanged: () => void;
// }

// export interface ITelegramWebApp {
//     initData: string;
//     initDataUnsafe: ITelegramInitData;
//     version: string;
//     platform: string;
//     colorScheme: 'light' | 'dark';
//     themeParams: ITelegramThemeParams;
//     isExpanded: boolean;
//     viewportHeight: number;
//     viewportStableHeight: number;
//     headerColor: string;
//     backgroundColor: string;
//     isClosingConfirmationEnabled: boolean;
    
//     // Методы
//     ready: () => void;
//     expand: () => void;
//     close: () => void;
//     sendData: (data: string) => void;
//     switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
//     openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
//     openTelegramLink: (url: string) => void;
//     openInvoice: (url: string, callback?: (status: string) => void) => void;
//     showPopup: (params: {
//         title?: string;
//         message: string;
//         buttons?: Array<{
//             id?: string;
//             type: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
//             text: string;
//         }>;
//     }, callback?: (buttonId: string) => void) => void;
//     showAlert: (message: string, callback?: () => void) => void;
//     showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
//     enableClosingConfirmation: () => void;
//     disableClosingConfirmation: () => void;
    
//     // Компоненты
//     MainButton: ITelegramMainButton;
//     BackButton: ITelegramBackButton;
//     SettingsButton: {
//         isVisible: boolean;
//         onClick: (callback: () => void) => void;
//         offClick: (callback: () => void) => void;
//         show: () => void;
//         hide: () => void;
//     };
//     HapticFeedback: ITelegramHapticFeedback;
    
//     // Cloud Storage
//     CloudStorage: {
//         setItem: (key: string, value: string) => Promise<void>;
//         getItem: (key: string) => Promise<string>;
//         getItems: (keys: string[]) => Promise<Record<string, string>>;
//         removeItem: (key: string) => Promise<void>;
//         removeItems: (keys: string[]) => Promise<void>;
//         getKeys: () => Promise<string[]>;
//     };
    
//     // Биометрия
//     BiometricManager: {
//         isInited: boolean;
//         isBiometricAvailable: boolean;
//         biometricType: 'finger' | 'face' | 'unknown';
//         isAccessRequested: boolean;
//         isAccessGranted: boolean;
//         isBiometricTokenSaved: boolean;
//         init: (params: {
//             request_access?: boolean;
//         }) => Promise<{
//             isBiometricAvailable: boolean;
//             isAccessGranted: boolean;
//             biometricType: 'finger' | 'face' | 'unknown';
//         }>;
//         authenticate: (params?: {
//             reason?: string;
//         }) => Promise<void>;
//         openSettings: () => void;
//         updateBiometricToken: (token: string) => Promise<void>;
//     };
    
//     // Viewport
//     onEvent: (eventType: string, callback: Function) => void;
//     offEvent: (eventType: string, callback: Function) => void;
    
//     // Методы для viewport
//     setHeaderColor: (color: string) => void;
//     setBackgroundColor: (color: string) => void;
// }

// // Типы для @telegram-apps/sdk
// declare module '@telegram-apps/sdk' {
//     export function init(): ITelegramWebApp;
//     export function isTMA(): boolean;
    
//     export const backButton: {
//         isSupported(): boolean;
//         show(): void;
//         hide(): void;
//         onClick(callback: () => void): void;
//         offClick(callback: () => void): void;
//         isVisible: boolean;
//     };
    
//     export const mainButton: {
//         isSupported(): boolean;
//         setText(text: string): void;
//         onClick(callback: () => void): void;
//         offClick(callback: () => void): void;
//         show(): void;
//         hide(): void;
//         enable(): void;
//         disable(): void;
//         showProgress(leaveActive?: boolean): void;
//         hideProgress(): void;
//         setParams(params: {
//             text?: string;
//             color?: string;
//             text_color?: string;
//             is_active?: boolean;
//             is_visible?: boolean;
//         }): void;
//     };
    
//     export const viewport: {
//         isSupported(): boolean;
//         expand(): void;
//         bindCssVars(): void;
//         on(event: string, callback: Function): void;
//         off(event: string, callback: Function): void;
//     };
    
//     export const themeParams: {
//         isSupported(): boolean;
//         get(): {
//             isDark: boolean;
//             params: ITelegramThemeParams;
//         };
//         on(event: string, callback: (params: { isDark: boolean; params: ITelegramThemeParams }) => void): void;
//         off(event: string, callback: Function): void;
//     };
    
//     export const webApp: {
//         isSupported(): boolean;
//         sendData(data: string): void;
//         close(): void;
//     };
// }
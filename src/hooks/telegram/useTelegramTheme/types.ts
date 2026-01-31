import { ITelegramThemeParams } from "models/telegram";

export type TUseTelegramTheme = () => ThemeHookResult;

// Хук для темы
export interface ThemeHookResult {
    theme: 'light' | 'dark';
    themeParams: ITelegramThemeParams;
}
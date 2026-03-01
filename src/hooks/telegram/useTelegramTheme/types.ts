export type TUseTelegramTheme = () => ThemeHookResult;

// Хук для темы
export interface ThemeHookResult {
    theme: 'light' | 'dark';
    themeParams: ITelegramThemeParams;
}

export interface ITelegramThemeParams {
    bg_color: string;
    text_color: string;
    hint_color: string;
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
}
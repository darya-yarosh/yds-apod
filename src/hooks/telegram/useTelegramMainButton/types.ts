
export type TUseTelegramMainButton = (options: MainButtonOptions) => void

// Типы для кнопки
export interface MainButtonOptions {
    text?: string;
    color?: string;
    textColor?: string;
    isActive?: boolean;
    isVisible?: boolean;
    onClick?: () => void;
}
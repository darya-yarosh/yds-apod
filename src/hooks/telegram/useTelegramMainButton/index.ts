import { useEffect } from "react";
import { init, isTMA } from "@telegram-apps/sdk";

import { TUseTelegramMainButton } from "./types";

// Хук для главной кнопки - теперь используем tg.MainButton
export const useTelegramMainButton: TUseTelegramMainButton = (options = {}) => {
    const {
        text = 'Продолжить',
        color,
        textColor,
        isActive = true,
        isVisible = true,
        onClick
    } = options;

    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            
            if (tg.MainButton) {
                tg.MainButton.setText(text);
                
                if (color || textColor) {
                    tg.MainButton.setParams({
                        color: color || undefined,
                        text_color: textColor || undefined
                    });
                }

                if (isActive) {
                    tg.MainButton.enable();
                } else {
                    tg.MainButton.disable();
                }

                if (isVisible) {
                    tg.MainButton.show();
                } else {
                    tg.MainButton.hide();
                }

                if (onClick) {
                    tg.MainButton.onClick(onClick);
                }

                return () => {
                    if (onClick) {
                        tg.MainButton.offClick(onClick);
                    }
                    tg.MainButton.hide();
                };
            }
        }
    }, [text, color, textColor, isActive, isVisible, onClick]);
};
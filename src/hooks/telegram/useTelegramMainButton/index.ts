import { useEffect } from "react";
import { init, isTMA, mainButton } from "@telegram-apps/sdk";

import { TUseTelegramMainButton } from "./types";

// Хук для главной кнопки - теперь используем mainButton
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
            
            if (mainButton) {
                mainButton.setParams({text: text});
                
                if (color) {
                    mainButton.setParams({backgroundColor: `#${color}`});
                }
                
                if (textColor) {
                    mainButton.setParams({textColor: `#${textColor}`});
                }

                if (isActive) {
                    mainButton.isEnabled();
                } else {
                    // mainButton.disable();
                }

                if (isVisible) {
                    // mainButton.show();
                } else {
                    // mainButton.hide();
                }

                if (onClick) {
                    mainButton.onClick(onClick);
                }

                return () => {
                    if (onClick) {
                        mainButton.offClick(onClick);
                    }
                    // mainButton.hide();
                };
            }
        }
    }, [text, color, textColor, isActive, isVisible, onClick]);
};
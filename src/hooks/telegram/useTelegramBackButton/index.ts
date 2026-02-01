import { useEffect } from 'react';
import { isTMA, backButton } from '@telegram-apps/sdk';

import { TUseTelegramBackButton } from './types';

// Хук для кнопки "Назад"
export const useTelegramBackButton:TUseTelegramBackButton = (onClick) => {
    useEffect(() => {
        if (isTMA() && backButton.isSupported()) {            
            backButton.mount();
            backButton.show();
            
            const handleClick = () => {
                if (onClick) {
                    onClick();
                } else {
                    window.history.back();
                }
            };
            
            backButton.onClick(handleClick);
            
            return () => {
                backButton.offClick(handleClick);
                backButton.hide();
            };
        }
    }, [onClick]);
};
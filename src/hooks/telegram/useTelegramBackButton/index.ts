import { useEffect } from 'react';
import { init, isTMA } from '@telegram-apps/sdk';

import { TUseTelegramBackButton } from './types';

// Хук для кнопки "Назад"
export const useTelegramBackButton:TUseTelegramBackButton = (onClick) => {
    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            
            if (tg.BackButton) {
                tg.BackButton.show();
                
                const handleClick = () => {
                    if (onClick) {
                        onClick();
                    } else {
                        window.history.back();
                    }
                };
                
                tg.BackButton.onClick(handleClick);
                
                return () => {
                    tg.BackButton.offClick(handleClick);
                    tg.BackButton.hide();
                };
            }
        }
    }, [onClick]);
};
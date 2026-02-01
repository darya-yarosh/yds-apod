import { useState, useEffect } from 'react';
import { init, isTMA, viewportHeight, viewportStableHeight, isViewportExpanded } from '@telegram-apps/sdk';

import { TUseTelegramViewport } from './types';

export const useTelegramViewport: TUseTelegramViewport = () => {
    const [viewportState, setViewportState] = useState({
        height: 0,
        stableHeight: 0,
        isExpanded: false,
    });

    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            
            const updateViewport = () => {
                setViewportState({
                    height: viewportHeight(),
                    stableHeight: viewportStableHeight(),
                    isExpanded: isViewportExpanded(),
                });
            };
            
            updateViewport();
            
            // Слушаем изменения viewport
            window.addEventListener('resize', updateViewport);
            
            return () => {
                window.removeEventListener('resize', updateViewport);
            };
        }
    }, []);

    return viewportState;
};
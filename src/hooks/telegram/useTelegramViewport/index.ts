import { useState, useEffect } from 'react';
import { init, isTMA } from '@telegram-apps/sdk';

import { TUseTelegramViewport, ViewportHookResult } from './types';

export const useTelegramViewport: TUseTelegramViewport = () => {
    const [viewportState, setViewportState] = useState<ViewportHookResult>({
        height: 0,
        stableHeight: 0,
        isExpanded: false,
    });

    useEffect(() => {
        if (isTMA()) {
            const tg = init();
            
            const updateViewport = () => {
                setViewportState({
                    height: tg.viewportHeight,
                    stableHeight: tg.viewportStableHeight,
                    isExpanded: tg.isExpanded,
                });
            };
            
            updateViewport();
            
            // Слушаем изменения viewport
            tg.onEvent('viewportChanged', updateViewport);
            
            return () => {
                tg.offEvent('viewportChanged', updateViewport);
            };
        }
    }, []);

    return viewportState;
};
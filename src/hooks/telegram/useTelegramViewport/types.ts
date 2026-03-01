export type TUseTelegramViewport = () => ViewportHookResult;

// Хук для viewport
export interface ViewportHookResult {
    height: number;
    stableHeight: number;
    isExpanded: boolean;
}
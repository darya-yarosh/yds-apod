import { TOrNull } from "models/TOrNull";

export type TUseFavoritesData = () => {
    favorites: TFavorites,
    fetch: () => Promise<void>,
    update: (data: TFavorites) => Promise<void>,
};

export type TFavorites = TOrNull<Array<string>>;
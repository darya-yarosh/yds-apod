import { ITelegramUser } from "models/telegram";
import { TOrNull } from "models/TOrNull";

export type TUseTelegramUser = () => TelegramUser;

export type TelegramUser = TOrNull<ITelegramUser>;
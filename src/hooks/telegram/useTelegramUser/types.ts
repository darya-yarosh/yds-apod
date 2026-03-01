import { User } from "@telegram-apps/types";
import { TOrNull } from "models/TOrNull";

export type TUseTelegramUser = () => TelegramUser;

export type TelegramUser = TOrNull<User>;
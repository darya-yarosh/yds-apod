import { ReactNode } from "react";
import { FC } from "react";

export type TTelegramProvider = FC<TProps>;

type TProps = {
    children: ReactNode,
};
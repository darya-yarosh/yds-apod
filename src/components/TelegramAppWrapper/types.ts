import { ReactNode } from "react";
import { FC } from "react";

export type TTelegramAppWrapper = FC<TProps>;

type TProps = {
    children: ReactNode,
};
import { CSSProperties, useCallback } from 'react';

import noImage from "../../assets/noimage.png";

import './Picture.css';

interface PictureProps {
    src: string,
    alt: string,
    height: number,
    width: number,
    isCover: boolean,
    onClick?: () => void,
}

export default function Picture({
    src,
    alt,
    height,
    width,
    isCover,
    onClick
}: PictureProps) {
    const stylesCover: CSSProperties = {
        'maxHeight': height,
        'maxWidth': width,
        'objectFit': 'cover',
        'minWidth': `${width}px`,
        'minHeight': `${height}px`,
    }

    const onError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.onerror = null; // отключаем повтор
        e.currentTarget.src = noImage;
    }, []);

    return (
        <div
            className="Picture_wrapper"
        >
            <img
                alt={alt}
                className={onClick !== undefined
                    ? "Picture_img Picture_imgHovered"
                    : "Picture_img"}
                src={src}
                style={isCover ? stylesCover : undefined}
                title={alt}
                onClick={onClick}
                onError={onError}
            />
        </div>
    )
}

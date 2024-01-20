import { CSSProperties } from 'react';

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

    return (
        <div
            className="Picture_wrapper"
        >
            <img
                src={src}
                title={alt}
                alt={alt}
                onClick={onClick}
                className={onClick !== undefined
                    ? "Picture_img Picture_imgHovered"
                    : "Picture_img"}

                style={isCover ? stylesCover : undefined}
            />
        </div>
    )
}

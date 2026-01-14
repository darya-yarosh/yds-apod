import { CSSProperties, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';

import noImage from "../../assets/noimage.png";

import './Picture.css';

interface PictureProps {
    src: string,
    alt: string,
    height: number,
    width: number,
    isCover: boolean,
    withLazyLoading?: boolean,
    onClick?: () => void,
}

export default function Picture({
    src,
    alt,
    height,
    width,
    isCover,
    withLazyLoading = false,
    onClick
}: PictureProps) {
    const ref = useRef<HTMLImageElement>(null);

    const [isLoading, setIsLoading] = useState(true);

    const classes = classNames("Picture_wrapper", isLoading && "Picture_wrapper_loading");

    const placeholderSrc = useMemo(() => `http://dummyimage.com/${width}x${height}"`, [width, height]);
    const initSrc = useMemo(() => withLazyLoading ? placeholderSrc : src, [withLazyLoading, placeholderSrc, src]);

    const stylesCover: CSSProperties = {
        'maxHeight': height,
        'maxWidth': width,
        'objectFit': 'cover',
        'minWidth': `${width}px`,
        'minHeight': `${height}px`,
    }

    const handleOnLoad = useCallback(() => {
        setIsLoading(false);
    }, []);

    /**
     * Lazy loading logic
     */
    const onError = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        e.currentTarget.onerror = null;
        e.currentTarget.src = noImage;
    }, []);

    useEffect(() => {
        if (!ref.current || !src || !withLazyLoading) {
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target as HTMLImageElement;

                    if (src) {
                        img.src = src;
                    }
                    observer.unobserve(img);
                }
            });
        }, {
            rootMargin: '100px', // The parameter for starting image loading 100px before it appears in the viewport
        });

        observer.observe(ref.current);

        return () => {
            if (ref.current) {
                observer.unobserve(ref.current);
            }
        };
    }, [withLazyLoading, src]);

    return (
        <div className={classes}>
            <img
                ref={ref}
                alt={alt}
                className={onClick !== undefined
                    ? "Picture_img Picture_imgHovered"
                    : "Picture_img"}
                src={initSrc}
                onLoad={handleOnLoad}
                style={isCover ? stylesCover : undefined}
                title={alt}
                onClick={onClick}
                onError={onError}
            />
        </div>
    )
}

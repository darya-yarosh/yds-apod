import { useCallback } from 'react';

import noImage from "../../assets/noimage.png";

import './Video.css';

interface VideoProps {
    src: string,
    title: string,
    height: number,
    width: number,
    withControls: boolean
}

export default function Video({
    src,
    title,
    height,
    width,
    withControls,
}: VideoProps) {
    const videoSrc = withControls
        ? src
        : `${src}?controls=0`;

    const onError = useCallback((e: React.SyntheticEvent<HTMLIFrameElement>) => {
        e.currentTarget.onerror = null; // отключаем повтор
        e.currentTarget.src = noImage;
    }, []);

    return <div className="Video_wrapper">
        <iframe
            title={title}
            height={height}
            width={width}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            src={videoSrc}
            frameBorder="0"
            onError={onError}
        >
        </iframe>
    </div>
}

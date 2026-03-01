import { useCallback, useEffect, useRef, useState } from 'react';

import noImage from "../../assets/noimage.png";
import { detectIframeError } from "./utils";

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
    /**
     * State
     */
    const iframeRef = useRef(null);

    const videoSrc = withControls
        ? src
        : `${src}?controls=0`;

    const [showButton, setShowButton] = useState(false);

    /**
     * Handlers
     */
    const onError = useCallback(() => {
        if (!iframeRef.current) {
            return;
        }

        (iframeRef.current as HTMLIFrameElement).onerror = null; // отключаем повтор
        (iframeRef.current as HTMLIFrameElement).innerHTML = "";
        (iframeRef.current as HTMLIFrameElement).src = noImage;
    }, []);

    useEffect(() => {
        const myIframe = iframeRef.current;
        detectIframeError(myIframe, (isError: any) => {
            if (isError) {
                onError();
                setShowButton(true);
            }
        });
    }, [onError]);

    /**
     * Renders
     */
    const renderContent = useCallback(() => {
        if (!showButton) {
            return (
                <iframe
                    id={"valid"}
                    ref={iframeRef}
                    title={title}
                    height={height}
                    width={width}
                    allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
                    src={videoSrc}
                    onError={onError}
                ></iframe>
            )
        }

        return (<>
            <img
                id={"invalid"}
                alt={title}
                height={height}
                width={width}
                src={noImage}
            />
            <a href={videoSrc} className="Video_button">{"Open video"}</a>
        </>);
    }, [height, showButton, title, videoSrc, width, onError]);

    return <div className="Video_wrapper">
        {renderContent()}
    </div>
}


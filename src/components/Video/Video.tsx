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
    return <div className="Video_wrapper">
        <iframe title={title} height={height} width={width}
            src={videoSrc}
            frameBorder="0"
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture">
        </iframe>
    </div>
}
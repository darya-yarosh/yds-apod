import { useNavigate } from 'react-router';

import { DateInfo } from 'models/dateInfo';

import Picture from 'components/Picture/Picture';

import './PictureGridCell.css';

interface PictureGridCellProps {
    dateInfo: DateInfo,
    height: number,
    width: number,
    onClick: (date: string) => void,
}

export default function PictureGridCell({
    dateInfo,
    height,
    width,
    onClick
}: PictureGridCellProps) {
    const navigate = useNavigate();

    const mediaSrc = dateInfo.media_type === "image"
        ? dateInfo.url
        : getVideoThumbnail(dateInfo.url);

    return <div className="PictureGridCell_wrapper">

            <Picture
                src={mediaSrc}
                alt={`Image of ${dateInfo.title} for ${dateInfo.date}`}
                height={height}
                width={width}
                isCover={true}
                onClick={() => navigate(`/date/${dateInfo.date}`)}
            />
        

    </div>
}

function getVideoThumbnail(url: string) {
    const splitterUrl = url.split('/');
    const videoId = splitterUrl[splitterUrl.length-1].split('?')[0];
    const videoThumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`
    return videoThumbnailUrl
}
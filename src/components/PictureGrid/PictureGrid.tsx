import { AstroPicData } from 'models/astroPicData';

import PictureGridCell from 'components/PictureGridCell/PictureGridCell';

import './PictureGrid.css';

interface PictureGridProps {
    dates: AstroPicData[],
    cellHeight: number,
    cellWidth: number,
    gap?: number,
    onClick?: (date: string) => void;
}

export default function PictureGrid({
    dates,
    cellHeight,
    cellWidth,
    gap = 16,
    onClick
}: PictureGridProps) {
    return (
        <div className="PictureGrid_wrapper">
            {dates.map(date =>
                <PictureGridCell
                    key={date.date}
                    dateInfo={date}
                    height={cellHeight}
                    width={cellWidth}
                    onClick={onClick}
                />
            )}
        </div>
    )
}

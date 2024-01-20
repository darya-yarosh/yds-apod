import { AstroPicData } from 'models/astroPicData';

import PictureGridCell from 'components/PictureGridCell/PictureGridCell';

import './PictureGrid.css';

interface PictureGridProps {
    dates: AstroPicData[],
    cellHeight: number,
    cellWidth: number,
    gap?: number,
}

export default function PictureGrid({
    dates,
    cellHeight,
    cellWidth,
    gap = 16
}: PictureGridProps) {
    return (
        <div className="PictureGrid_wrapper">
            {dates.map(date =>
                <PictureGridCell
                    key={date.date}
                    dateInfo={date}
                    height={cellHeight}
                    width={cellWidth}
                    onClick={() => { }}
                />
            )}
        </div>
    )
}

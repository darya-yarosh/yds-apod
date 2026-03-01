import PictureGridCell from 'components/PictureGridCell/PictureGridCell';
import { AstroPicData } from 'models/astroPicData';

import './PictureGrid.css';

interface PictureGridProps {
    dates: AstroPicData[],
    cellHeight: number,
    cellWidth: number,
    gap?: number,
    showFavoriteButton: boolean;
    onAfterFavoriteToggle?: (date: string) => void;
}

export default function PictureGrid({
    dates,
    cellHeight,
    cellWidth,
    gap = 16,
    showFavoriteButton,
    onAfterFavoriteToggle,
}: PictureGridProps) {
    return (
        <div className="PictureGrid_wrapper">
            {dates.map(date =>
                <PictureGridCell
                    key={date.date}
                    dateInfo={date}
                    height={cellHeight}
                    width={cellWidth}
                    showFavoriteButton={showFavoriteButton}
                    onAfterFavoriteToggle={onAfterFavoriteToggle}
                />
            )}
        </div>
    )
}

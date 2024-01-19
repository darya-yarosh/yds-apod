import { DateInfo } from 'models/dateInfo';

import PictureGridCell from 'components/PictureGridCell/PictureGridCell';

import './PictureGrid.css';

interface PictureGridProps {
    dates: DateInfo[],
    rows: number,
    columns: number,
    cellHeight: number,
    cellWidth: number,
    gap?: number,
}

export default function PictureGrid({
    dates,
    rows,
    columns,
    cellHeight,
    cellWidth,
    gap = 16
}: PictureGridProps) {
    const maxColumns =
        window.outerWidth > 1024
            ? 7
            : window.outerWidth > 768
                ? 4
                : window.outerWidth > 600
                    ? 3
                    : 2;

    const selectedColumns =
        columns < maxColumns
            ? columns
            : maxColumns;

    return <div
        style={{
            gap: `${gap}px`,
            gridTemplateColumns: ('1fr '.repeat(selectedColumns)),
            maxHeight: `${(cellHeight * 5 + gap * (rows - 1))}px`,
            padding: `${gap}px`,
        }}
        className="PictureGrid_wrapper"
    >
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
}

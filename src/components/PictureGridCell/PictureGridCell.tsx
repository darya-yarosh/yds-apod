import { useCallback } from 'react';
import { useNavigate } from 'react-router';

import { AstroPicData } from 'models/astroPicData';

import Picture from 'components/Picture/Picture';

import { useFavoritesData } from 'hooks/telegram/useFavoritesData';

import './PictureGridCell.css';

interface PictureGridCellProps {
    dateInfo: AstroPicData,
    height: number,
    width: number,
    showFavoriteButton: boolean,
    onAfterFavoriteToggle?: (date: string) => void,
}

export default function PictureGridCell({
    dateInfo,
    height,
    width,
    showFavoriteButton,
    onAfterFavoriteToggle
}: PictureGridCellProps) {
    /**
     * Default state
    */
   const navigate = useNavigate();
   
   const mediaSrc = dateInfo.media_type === "image"
   ? dateInfo.url
   : getVideoThumbnail(dateInfo.url);

   /**
    * Telegram state
    */
   const { favorites, update} = useFavoritesData();

   /**
    * Handlers
    */
    const handleToggleFavorite = useCallback(async () => {
        
        if (!favorites) {
            return;
        }
        
        const isActive = favorites?.find((el) => el === dateInfo.date)
        if (isActive) {
            await update(favorites.filter((el) => el !== dateInfo.date));
        } else {
            await update([...favorites, dateInfo.date]);
        }

        if (onAfterFavoriteToggle) {
            onAfterFavoriteToggle(dateInfo.date) 
            return;
        }
    }, [dateInfo.date, favorites, onAfterFavoriteToggle, update])

    const onNavigateToDatePhoto = useCallback(() => 
        navigate(`/date/${dateInfo.date}`)
    , [dateInfo.date, navigate]);

    return <div className="PictureGridCell_wrapper">
        <Picture
            src={mediaSrc}
            alt={`Image of ${dateInfo.title} for ${dateInfo.date}`}
            height={height}
            width={width}
            isCover={true}
            onClick={onNavigateToDatePhoto}
        />

        {showFavoriteButton && <span 
            className='PictureGridCell_favoriteBtn' 
            onClick={handleToggleFavorite}
        >
            {"⭐"}
        </span>}
    </div>
}

function getVideoThumbnail(url: string) {
    if (!url) {
        return "/";
    }

    const splitterUrl = url.split('/');
    const videoId = splitterUrl[splitterUrl.length - 1].split('?')[0];
    const videoThumbnailUrl = `https://img.youtube.com/vi/${videoId}/0.jpg`
    return videoThumbnailUrl
}

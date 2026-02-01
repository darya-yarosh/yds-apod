import { useTelegram } from 'components/TelegramProvider';
import Loader from 'components/Loader/Loader';

import { TTelegramAppWrapper } from './types';

const TelegramAppWrapper: TTelegramAppWrapper = ({ children }) => {
    const { isReady, isTMA } = useTelegram();

    if (isTMA && !isReady) {
        return (
            <div className="telegram-loading">
                <div>Загрузка Telegram Mini App...</div>
                <Loader />
            </div>
        );
    }

    return (
        <div className={`telegram-app`}>
            {children}
        </div>
    );
};

export default TelegramAppWrapper;
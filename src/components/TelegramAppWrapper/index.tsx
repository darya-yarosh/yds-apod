import { useTelegram } from 'components/TelegramProvider';

import { TTelegramAppWrapper } from './types';

const TelegramAppWrapper: TTelegramAppWrapper = ({ children }) => {
    const { isReady, isTMA } = useTelegram();

    if (isTMA && !isReady) {
        return (
            <div className="telegram-loading">
                <div>Загрузка Telegram Mini App...</div>
                <span>{isTMA} & {isReady}</span>
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
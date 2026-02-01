import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import StateDate from 'components/StateDate/StateDate';
import StatePeriod from 'components/StatePeriod/StatePeriod';

import { convertDateToYYYYMMDD, getTodayUTCDate } from 'logic/utils/dateConverter';

import { TOrNull } from 'models/TOrNull';

import { useTelegramUser } from 'hooks/telegram/useTelegramUser';
import { useTelegramCloudStorage } from 'hooks/telegram/useTelegramCloudStorage';

import './Header.css';

export default function Header() {
    const navigate = useNavigate();
    const params = useParams();

    const isDate = params.date !== undefined;
    const isPeriod = params.period !== undefined;

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    const onNavigate = useCallback((event: React.ChangeEvent<HTMLSelectElement>) => {
        const pageAddress = event.target.value;
        navigate(pageAddress);
    }, [navigate]);

    const optionsValue = useMemo(() => [
        [
            `/date/${convertDateToYYYYMMDD(getTodayUTCDate(), '-')}`,
            'Single'
        ],
        [
            `/period/${convertDateToYYYYMMDD(getTodayUTCDate(), '.')}-${convertDateToYYYYMMDD(getTodayUTCDate(), '.')}`,
            'Period'
        ]
    ], []);

    const TGUserInfo = useTelegramUser();
    const TGCloudStorage = useTelegramCloudStorage();

    const [tgFavourites, setTgFavourites] = useState<TOrNull<string>>(null);

    const updFavourites = useCallback(async (favouritesData: string) => {
        try {
            if (!TGCloudStorage) {
                return;
            }
            
            let currentFavourites = tgFavourites;
            
            if (!currentFavourites) {
                currentFavourites = await TGCloudStorage.getItem("favourites");
                
                if (!currentFavourites) {
                    return;
                }
                
                setTgFavourites(currentFavourites);
            }
            
            TGCloudStorage.setItem("favourites", favouritesData);
        } catch {}
    }, [TGCloudStorage, tgFavourites]);

    useEffect(() => {
        updFavourites("123");
    }, [updFavourites]);

    // Обработчик изменения размера окна
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
            if (window.innerWidth >= 768) {
                setIsMenuOpen(false); // На десктопе закрываем меню
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Закрытие меню при клике вне его области
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (isMenuOpen && !target.closest('.Header_burgerMenu') && !target.closest('.Header_burgerButton')) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [isMenuOpen]);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((current) => !current);
    }, []);

    const renderState = useCallback(() => {
        return (
            <section className="Header_state">
                {isDate &&
                    <StateDate />
                }
                {isPeriod &&
                    <StatePeriod />
                }
            </section>
        );
    }, [isDate, isPeriod]);

    const renderTitle = useCallback(() => {
        return (
            <section className="Header_appName">
                <span>ASTRONOMY</span>
                <span>PICTURE OF THE DAY</span>
            </section>
        )
    }, []);

    const renderPagesSelector = useCallback(() => {
        return (
            <section className="Header_pagesSelector">
                {(isDate || isPeriod) &&
                    <>
                        <label>Date: </label>
                        <select
                            title='Page'
                            onChange={onNavigate}
                            value={
                                isDate
                                    ? optionsValue[0][0]
                                    : optionsValue[1][0]
                            }
                        >
                            <option value={optionsValue[0][0]}>{optionsValue[0][1]}</option>
                            <option value={optionsValue[1][0]}>{optionsValue[1][1]}</option>
                        </select>
                    </>
                }
            </section>
        );
    }, [isDate, isPeriod, optionsValue, onNavigate]);

    const renderTgUser = useCallback(() => {
        return (
            <section className="Header_tgUser">
                <span>{TGUserInfo?.first_name}</span>
                <span>{TGUserInfo?.username}</span>
            </section>
        )
    }, [TGUserInfo?.first_name, TGUserInfo?.username]);

    const renderBurgerButton = useCallback(() => {
        return (
            <button 
                className="Header_burgerButton"
                onClick={toggleMenu}
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
                <span className={`Header_burgerLine ${isMenuOpen ? 'Header_burgerLine--top' : ''}`}></span>
                <span className={`Header_burgerLine ${isMenuOpen ? 'Header_burgerLine--middle' : ''}`}></span>
                <span className={`Header_burgerLine ${isMenuOpen ? 'Header_burgerLine--bottom' : ''}`}></span>
            </button>
        );
    }, [isMenuOpen, toggleMenu]);

    const renderMobileMenu = useCallback(() => {
        return (
            <div className={`Header_burgerMenu ${isMenuOpen ? 'Header_burgerMenu--open' : ''}`}>
                <div className="Header_burgerMenuContent">
                    {renderState()}
                    {renderPagesSelector()}
                    {renderTgUser()}
                </div>
            </div>
        );
    }, [isMenuOpen, renderState, renderPagesSelector, renderTgUser]);
    
    return (
        <header className="Header_wrapper">
            {renderTitle()}
            
            {renderBurgerButton()}
            {renderMobileMenu()}
            
            {/* Overlay для мобильного меню */}
            {isMobile && isMenuOpen && (
                <div 
                    className="Header_menuOverlay"
                    onClick={() => setIsMenuOpen(false)}
                />
            )}
        </header>
    );
}
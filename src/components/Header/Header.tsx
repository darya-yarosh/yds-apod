import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import StateDate from 'components/StateDate/StateDate';
import StatePeriod from 'components/StatePeriod/StatePeriod';

import { convertDateToYYYYMMDD, getTodayUTCDate } from 'logic/utils/dateConverter';

import { TOrNull } from 'models/TOrNull';

// import { useTelegramUser } from 'hooks/telegram/useTelegramUser';
import { useTelegramCloudStorage } from 'hooks/telegram/useTelegramCloudStorage';

import './Header.css';

export default function Header() {
    const navigate = useNavigate();
    const params = useParams();

    const isDate = params.date !== undefined;
    const isPeriod = params.period !== undefined;

    function onNavigate(event: React.ChangeEvent<HTMLSelectElement>) {
        const pageAddress = event.target.value;
        navigate(pageAddress);
    }

    const optionsValue = [
        [
            `/date/${convertDateToYYYYMMDD(getTodayUTCDate(), '-')}`,
            'Single'
        ],
        [
            `/period/${convertDateToYYYYMMDD(getTodayUTCDate(), '.')}-${convertDateToYYYYMMDD(getTodayUTCDate(), '.')}`,
            'Period'
        ]
    ]

    // const TGUserInfo = useTelegramUser();
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

    return <header className="Header_wrapper">
        <div className='Header_row'>
            <section className="Header_state">
                {isDate &&
                    <StateDate />
                }
                {isPeriod &&
                    <StatePeriod />
                }
            </section>
            <section className="Header_appName">
                <span>ASTRONOMY</span>
                <span>PICTURE OF THE DAY</span>
            </section>
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
        </div>
        {/* <div className='Header_row'>
            <span>{TGCloudStorage?.storage}</span>
            <span>{tgFavourites}</span>
            <span>{TGUserInfo?.first_name}</span>
            <span>{TGUserInfo?.username}</span>
        </div> */}
    </header >
}
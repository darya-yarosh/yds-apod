import { useNavigate, useParams } from 'react-router-dom';

import StateDate from 'components/StateDate/StateDate';
import StatePeriod from 'components/StatePeriod/StatePeriod';

import { convertDateToYYYYMMDD, getTodayDate } from 'logic/utils/dateConverter';

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
            `/date/${convertDateToYYYYMMDD(getTodayDate(), '-')}`,
            'Date'
        ],
        [
            `/period/${convertDateToYYYYMMDD(getTodayDate(), '.')}-${convertDateToYYYYMMDD(getTodayDate(), '.')}`,
            'Period'
        ]
    ]

    return <header className="Header_wrapper">
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
                    <label>Page: </label>
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
    </header >
}
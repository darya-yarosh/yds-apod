import { useNavigate } from 'react-router';

import './ErrorPage.css';

export default function ErrorPage() {
    const navigate = useNavigate();

    return <>
        <div className="ErrorPage_wrapper">
            <div className="ErrorPage_body">
                <header>
                    <h1>Something went wrong.</h1>
                    <p>Current address is invalid.</p>
                    <p>Try changing the date or follow these steps.</p>
                </header>
                <nav>
                    <button onClick={() => navigate(-1)}>Go to previous page</button>
                    <button onClick={() => navigate('/')}>Go to main page</button>
                </nav>
            </div>
        </div>
    </>
}

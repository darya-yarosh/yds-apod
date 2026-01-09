import { useNavigate } from 'react-router';
import { useCallback } from 'react';

import './ErrorPage.css';

export default function ErrorPage() {
    const navigate = useNavigate();

    /**
     * Handlers
     */
    const handleNavToPrevPage = useCallback(() => {
        navigate(-1);
    }, [navigate]);

    const handleNavToMainPage = useCallback(() => {
        navigate('/')
    }, [navigate]);

    /**
     * Renders
     */
    const renderHeader = useCallback(() => {
        return (
            <header>
                <h1>Something went wrong.</h1>
                <p>Current address is invalid.</p>
                <p>Try changing the date or follow these steps.</p>
            </header>
        );
    }, []);

    const renderNav = useCallback(() => {
        return (
            <nav>
                <button onClick={handleNavToPrevPage} type="button">Go to previous page</button>
                <button onClick={handleNavToMainPage} type="button">Go to main page</button>
            </nav>
        );
    }, [handleNavToPrevPage, handleNavToMainPage]);

    return <>
        <div className="ErrorPage_wrapper">
            <div className="ErrorPage_body">
                {renderHeader()}
                {renderNav()}
            </div>
        </div>
    </>
}

import {
	createBrowserRouter,
	createRoutesFromElements,
	Outlet,
	Route,
	RouterProvider,
} from 'react-router-dom';

import Header from 'components/Header/Header';
import Footer from 'components/Footer/Footer';

import DatePage from 'pages/DatePage/DatePage';
import PeriodPage from 'pages/PeriodPage/PeriodPage';
import MainPage from 'pages/MainPage/MainPage';
import ErrorPage from 'pages/ErrorPage/ErrorPage';

import './App.css';
import TelegramAppWrapper from 'components/TelegramAppWrapper';
import { useTelegram } from 'components/TelegramProvider';
import { isTMA } from '@telegram-apps/sdk';

export const router = createBrowserRouter(
	createRoutesFromElements([
		<Route
			path="/"
			element={<PageWrapper />}
			errorElement={
				<ErrorPage />
			}
		>
			<Route
				path="/"
				element={<MainPage />}
				errorElement={
					<ErrorPage />
				}
			/>,
			<Route
				path="date/:date"
				element={<DatePage />}
				errorElement={
					<ErrorPage />
				}
			/>,
			<Route
				path="period/:period"
				element={<PeriodPage />}
				errorElement={
					<ErrorPage />
				}
			/>,
			<Route
				path="error"
				element={<ErrorPage />}
				errorElement={<ErrorPage />}
			/>
			<Route
				path="error/:error_code"
				element={<ErrorPage />}
			/>
		</Route>,
	])
);

function PageWrapper() {
	return <>
		<Header />
		<Outlet />
		<Footer />
	</>
}

export default function App() {
	const { isTMA: isTMAMethod } = useTelegram();
	let consoleLog = `isTMA?, ${isTMAMethod}, ${isTMA()}, ${!!window}`;
	console.log(consoleLog);

	if (isTMAMethod) {
        return (
			<div className="App">
				<TelegramAppWrapper>
					<RouterProvider router={router} />
				</TelegramAppWrapper>
			</div>
        );
    }

	return (
		<div className="App">
			<span>{consoleLog}</span>
			<RouterProvider router={router} />
		</div>
	);
}

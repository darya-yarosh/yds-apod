import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
} from 'react-router-dom';

import DatePage from 'pages/DatePage/DatePage';
import PeriodPage from 'pages/PeriodPage/PeriodPage';
import MainPage from 'pages/MainPage/MainPage';
import ErrorPage from 'pages/ErrorPage/ErrorPage';

import PageWrapper from 'layout/PageWrapper';

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
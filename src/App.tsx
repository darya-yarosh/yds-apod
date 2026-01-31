import {
	RouterProvider,
} from 'react-router-dom';
import { isTMA } from '@telegram-apps/sdk';

import { router } from 'router';
import TelegramAppWrapper from 'components/TelegramAppWrapper';
import { TelegramProvider, useTelegram } from 'components/TelegramProvider';

import './App.css';

const AppContent = () => {
	const { isTMA: isTMAMethod } = useTelegram();
	let consoleLog = `isTMA?, ${isTMAMethod}, ${isTMA()}, ${!!window}`;

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

const App = () => {
	return (
		<TelegramProvider>
			<AppContent />
		</TelegramProvider>
	)
}

export default App;

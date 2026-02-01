import {
	RouterProvider,
} from 'react-router-dom';

import { router } from 'router';
import TelegramAppWrapper from 'components/TelegramAppWrapper';
import { TelegramProvider, useTelegram } from 'components/TelegramProvider';

import './App.css';

const AppContent = () => {
	const { isTMA } = useTelegram();
	let consoleLog = `isTMA?, ${isTMA}, ${!!window}`;

	if (isTMA) {
        return (
			<div className="App">
				<TelegramAppWrapper>
					<span>{"1"+consoleLog}</span>
					<RouterProvider router={router} />
				</TelegramAppWrapper>
			</div>
        );
    }

	return (
		<div className="App">
			<span>{"2:"+consoleLog}</span>
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

import {
	RouterProvider,
} from 'react-router-dom';

import { router } from 'router';
import TelegramAppWrapper from 'components/TelegramAppWrapper';
import { TelegramProvider, useTelegram } from 'components/TelegramProvider';

import './App.css';

const AppContent = () => {
	const { isTMA } = useTelegram();

	if (isTMA) {
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

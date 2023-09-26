import './index.css';

import 'toastr/build/toastr.min.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import React from 'react';
import ReactDOM from 'react-dom/client';
import Provider from './components/Provider.tsx';
import App from './App.tsx';
import Register from './pages/register.tsx';
import Login from './pages/login.tsx';

const router = createBrowserRouter([
	{
		children: [
			{
				path: '/',
				element: <App />,
			},
			{
				path: '/register',
				element: <Register />,
			},
			{
				path: '/login',
				element: <Login />,
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<Provider>
			<RouterProvider router={router} />
		</Provider>
	</React.StrictMode>
);

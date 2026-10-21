import '@/App.css';
import { BrowserRouter, Route, Routes } from 'react-router';
import Home from '@/routes/Home';
import Register from '@/routes/Register';
import Login from '@/routes/Login';
import MovieScreeningDetails from './routes/MovieScreeningDetails';

function App() {
	return (
		<>
			<BrowserRouter>
				<Routes>
					<Route index element={<Login />} />
					<Route path='register' element={<Register />} />
					<Route path='home' element={<Home />} />
					<Route path='movie-screening-details/:id' element={<MovieScreeningDetails />} />
					<Route path='*' element={<div>404</div>} />
				</Routes>
			</BrowserRouter>
		</>
	);
}

export default App;

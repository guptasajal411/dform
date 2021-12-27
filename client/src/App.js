import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={ <HomePage /> } exact />
				<Route path="/login" element={ <Login /> } exact />
				<Route path="/register" element={ <Register /> } exact />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

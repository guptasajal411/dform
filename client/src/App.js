import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import New from "./pages/New";
import Form from "./pages/Form";
import Responses from "./pages/Responses";

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={ <HomePage /> } exact />
				<Route path="/login" element={ <Login /> } exact />
				<Route path="/register" element={ <Register /> } exact />
				<Route path="/dashboard" element={ <Dashboard /> } exact />
				<Route path="/new" element={ <New /> } exact />
				<Route path="/form/:formSlug" element={ <Form /> }  />
				<Route path="/responses/:formSlug" element={ <Responses /> }  />
			</Routes>
		</BrowserRouter>
	);
}

export default App;

import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserContext from "./context/UserContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
import New from "./pages/New";
import Form from "./pages/Form";
import Responses from "./pages/Responses";

function App() {
	const [user, setUser] = useState({ username: localStorage.getItem("username"), token: localStorage.getItem("token") } || null);
	console.log(user)
	return (
		<UserContext.Provider value={{user: user, setUser: setUser}}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<HomePage />} exact />
					<Route path="/login" element={user.username ? <Dashboard /> : <Login />} exact />
					<Route path="/register" element={user.username ? <Dashboard /> : <Register />} exact />
					<Route path="/dashboard" element={user.username ? <Dashboard /> : <HomePage />} exact />
					<Route path="/new" element={user.username ? <New /> : <HomePage />} exact />
					<Route path="/responses/:formSlug" element={user.username ? <Responses /> : <HomePage />} />
					<Route path="/form/:formSlug" element={<Form />} />
				</Routes>
			</BrowserRouter>
		</UserContext.Provider>
	);
}

export default App;

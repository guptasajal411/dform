import React, { useState } from 'react'
import Navbar from "../components/Navbar"

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(false);
    let inMemoryToken;

    async function postLogin(event) {
        event.preventDefault();
        setIsFetching(true);
        await fetch("http://localhost:3001/api/login", {
            headers: { "content-type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                email,
                password
            })
        })
            .then(response => response.json())
            .then(jsonData => {
                if (jsonData.token) {
                    setIsFetching(false);
                    setError(false);
                    setMessage(jsonData.message);
                    localStorage.setItem("token", jsonData.token)
                    // setTimeout(() => {
                    //     window.location.href = "/dashboard";
                    // }, 800);
                } else {
                    setIsFetching(false);
                    setError(true);
                    setMessage(jsonData.message);
                    localStorage.removeItem("token");
                }
            });
    }
    return (
        <>
            <Navbar />
            <div>
                <h1>Login</h1>
                <form onSubmit={postLogin}>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="email"
                        required
                    />
                    <br />
                    <input
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="password"
                        required
                    />
                    <br />
                    <button type="submit" disabled={isFetching}>
                        {isFetching ? "Logging you in..." : "Login"}
                    </button>
                    <br />
                    <p style={{ color: error ? 'red' : 'green' }}>
                        {message}
                    </p>
                </form>
            </div>
        </>
    );
}
import React, { useState } from 'react'
import Navbar from "../components/Navbar"

export default function Register() {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(false);

    async function postRegister(event) {
        event.preventDefault();
        setIsFetching(true);
        await fetch("http://localhost:3001/api/register", {
            headers: { "content-type": "application/json" },
            method: "POST",
            body: JSON.stringify({
                firstName,
                lastName,
                username,
                email,
                password
            })
        })
            .then(response => response.json())
            .then(jsonData => {
                if (jsonData.status === "ok") {
                    setIsFetching(false);
                    setError(false);
                    setMessage(jsonData.message);
                    setTimeout(() => {
                        window.location.href = "/login";
                    }, 800);
                } else if (jsonData.status === "error") {
                    setIsFetching(false);
                    setError(true);
                    setMessage(jsonData.message);
                }
            });
    }
    return (
        <>
            <Navbar />
            <div>
                <h1>Register</h1>
                <form onSubmit={postRegister}>
                    <input
                        type="text"
                        value={firstName}
                        onChange={e => setFirstName(e.target.value)}
                        placeholder="first name"
                        required
                    />
                    <br />
                    <input
                        type="text"
                        value={lastName}
                        onChange={e => setLastName(e.target.value)}
                        placeholder="last name"
                        required
                    />
                    <br />
                    <input
                        type="text"
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        placeholder="username"
                        required
                    />
                    <br />
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
                        {isFetching ? "Registering you..." : "Register"}
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
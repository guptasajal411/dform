import React, { useState } from 'react'
import domain from "../common/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/Register.css";
import "./css/Fonts.css";

export default function Register() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(false);

    async function postRegister(event) {
        event.preventDefault();
        setIsFetching(true);
        await fetch(domain + "/api/register", {
            headers: { "content-type": "application/json" },
            method: "POST",
            body: JSON.stringify({
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
            <div className="section1 d-flex align-items-center justify-content-center">
                <div className="registerContainer">
                    <form onSubmit={postRegister}>
                        <h3 className="white text-center mb-4">Create an account</h3>
                        <div className="mx-3">
                            <p className="registerLabel white2 m-0 pt-2">EMAIL</p>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="registerInput mb-4 white"
                                required
                            />
                            <p className="registerLabel white2 m-0">USERNAME</p>
                            <input
                                type="text"
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                                className="registerInput mb-4 white"
                                required
                            />
                            <p className="registerLabel white2 m-0">PASSWORD</p>
                            <input
                                type="password"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="registerInput mb-4 white"
                                required
                            />
                            <button type="submit" disabled={isFetching} className="registerButton white py-2" style={{ background: isFetching && "#4959ff" }}>
                                {isFetching ? "Registering you..." : "Register"}
                            </button>
                            <p className="white3">Already have an account? <a href="/login" className="white2">Login</a> </p>
                            <p style={{ color: error && 'rgb(237, 66, 69)' }}>
                                {error && message}
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}
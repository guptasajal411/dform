import React, { useState } from 'react';
import domain from "../common/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/Login.css";
import "./css/Fonts.css";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isFetching, setIsFetching] = useState(false);
    const [error, setError] = useState(false);

    async function postLogin(event) {
        event.preventDefault();
        setIsFetching(true);
        await fetch(domain + "/api/login", {
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
                    window.location.href = "/dashboard";
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
            <div className="section1 d-flex align-items-center justify-content-center">
                <div className="formContainer">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-8 col-12 pe-lg-5">
                                <form onSubmit={postLogin}>
                                    <h3 className="text-center white">Welcome back!</h3>
                                    <p className="text-center white2 mb-4">We're so excited to see you again!</p>
                                    <p className="inputLabel white2 m-0">EMAIL</p>
                                    <input
                                        type="email"
                                        className="formInput mb-4 white"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        required autofocus
                                    />
                                    <p className="inputLabel white2 m-0">PASSWORD</p>
                                    <input
                                        type="password"
                                        className="formInput mb-4 white"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        required
                                    />
                                    <button type="submit" disabled={isFetching} className="formButton py-2 white" style={{ background: isFetching && "#4959ff" }}>
                                        {isFetching ? "Logging you in..." : "Login"}
                                    </button>
                                    <p className="smallText white3">Need an account? <a href="/register" className="white2">Register</a></p>
                                    <p style={{ color: error && 'rgb(237, 66, 69)' }}>
                                        {error && message}
                                    </p>
                                </form>
                            </div>
                            <div className="col-lg-4 col-0 image">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
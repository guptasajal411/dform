import React, { useEffect, useState, useContext, useRef } from 'react';
import { Link, useNavigate } from "react-router-dom";
import UserContext from '../context/UserContext';
import domain from "../common/api";
import 'bootstrap/dist/css/bootstrap.min.css';
import "./css/Fonts.css";
import "./css/Dashboard.css";

export default function Dashboard() {
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState();
    const [dashboardData, setDashboardData] = useState([]);
    const { user, setUser } = useContext(UserContext);
    const scrollRef = useHorizontalScroll();

    function useHorizontalScroll() {
        const elRef = useRef();
        useEffect(() => {
            const el = elRef.current;
            if (el) {
                const onWheel = e => {
                    if (e.deltaY == 0) return;
                    e.preventDefault();
                    el.scrollTo({
                        left: el.scrollLeft + e.deltaY,
                        behavior: "smooth"
                    });
                };
                el.addEventListener("wheel", onWheel);
                return () => el.removeEventListener("wheel", onWheel);
            }
        }, []);
        return elRef;
    }

    useEffect(() => {
        async function dashboard() {
            if (user.username) {
                await fetch(domain + "/api/dashboard", {
                    headers: { "x-access-token": user.token, "username": user.username },
                    method: "GET"
                })
                    .then(response => response.json())
                    .then((jsonData) => {
                        if (jsonData.status === "ok") {
                            setDashboardData(jsonData.dashboardData);
                        } else {
                            setErrorMessage(jsonData.message);
                            setTimeout(() => {
                                setUser({ username: null, token: null });
                                localStorage.removeItem("token");
                                localStorage.removeItem("username");
                                navigate("/login");
                            }, 1500);
                        }
                    });
            } else {
                // token not available
                setErrorMessage("Please try to log in first. Redirecting...");
                setTimeout(() => {
                    setUser({ username: null, token: null });
                    localStorage.removeItem("token");
                    localStorage.removeItem("username");
                    navigate("/login");
                }, 1500);
            }
        }
        dashboard();
    }, []);

    const handleLogout = () => {
        setTimeout(() => {
            setUser({ username: null, token: null });
            localStorage.removeItem("token");
            localStorage.removeItem("username");
            navigate("/");
        }, 400);
    }

    return (
            <div>
                {user.username ? <h1>Welcome, {user.username}</h1> : <h1>Welcome</h1>}
                <hr />
                {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
                {!errorMessage &&
                    <div>
                        <h1>Your forms</h1>
                        <a href="/new">
                            <button>
                                Create a new form ▶
                            </button>
                        </a>
                        <p>Your total forms: {dashboardData.length}</p>
                        {dashboardData.map((formData) => (
                            <div style={{ border: "1px solid red" }}>
                                <h2>{formData.formTitle}</h2>
                                <p>{formData.formDescription}</p>
                                <p>Views: {formData.formViews}</p>
                                <p>Submissions: {formData.formSubmissions}</p>
                                <a href={"/form/" + formData.formSlug}>
                                    <button>
                                        View this form ▶
                                    </button>
                                </a>
                                <a href={"/responses/" + formData.formSlug}>
                                    <button>
                                        Responses ▶
                                    </button>
                                </a>
                            </div>
                        ))}
                    </div>
                }
            </div>
    );
}
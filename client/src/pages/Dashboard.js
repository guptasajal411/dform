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
            <div className="section1">
                <div className="container pt-3">
                    <div className="row justify-content-between align-items-center">
                        <div className="col-6 col-md-4">
                            <h2 className="my-auto">
                                <Link to="/" className="white">dForm</Link>
                            </h2>
                        </div>
                        <div className="col-6 col-md-4">
                            {user.username && <button onClick={handleLogout} className="secondaryButton float-end d-flex align-items-center justify-content-around px-sm-4 px-2">
                                <p className="my-0 me-2">Sign Out</p>
                                <span class="material-icons-outlined">
                                    logout
                                </span>
                            </button>}
                        </div>
                    </div>
                </div>
                <div className="dashboardSection2 my-5 mx-4 mx-md-5 p-lg-5 p-md-4 p-sm-3 p-2">
                    <div classname="metadata">
                        <h2 className="white text-sm-start text-center mt-sm-0 mt-2">Welcome, {user.username}</h2>
                        <div className="row">
                            <div className="col-6">
                                <h4 className="white2 my-3 text-start">Your Forms</h4>
                            </div>
                            <div className="col-6">
                                {(() => {
                                    switch (dashboardData.length) {
                                        case 0: return <h4 className="white2 my-3 text-end">No forms</h4>;
                                        case 1: return <h4 className="white2 my-3 text-end">1 form</h4>;
                                        default: return <h4 className="white2 my-3 text-end">{dashboardData.length} forms</h4>;
                                    }
                                })()}
                            </div>
                        </div>
                        <hr className="dashboardRule" />
                    </div>
                    <div className="horizontalScroll d-flex align-items-center justify-content-center">
                        <div ref={scrollRef} className="d-flex flex-row formBoxContainer">
                            <div className="formBox d-flex align-items-center justify-content-center" onClick={() => { navigate("/new") }}>
                                <i tabindex="0" cursor="default" class="material-icons-outlined">
                                    add
                                </i>
                            </div>
                            {dashboardData.map(formData => (
                                <div className="formBox white2 p-4">
                                    <Link to={"/form/" + formData.formSlug}>
                                        <h2 className="truncateToOneLine white2">{formData.formTitle}</h2>
                                        <p className="truncateToOneLine white2">{formData.formDescription}</p>
                                    </Link>
                                    <div className="absoluteChild">
                                        <div className="views mb-2">
                                            <div className="d-flex justify-content-left align-items-center">
                                                <i class="material-icons-outlined me-3">
                                                    visibility
                                                </i>
                                                <span>{formData.formViews}</span>
                                            </div>
                                        </div>
                                        <div className="link mb-2">
                                            <Link to={"/form/" + formData.formSlug} className="white2 d-flex justify-content-left align-items-center">
                                                <i class="material-icons-outlined me-3">
                                                    link
                                                </i>
                                                <span className="hoverUnderline">Go to form</span>
                                            </Link>
                                        </div>
                                        <div className="responses">
                                            <Link to={"/responses/" + formData.formSlug} className="white2 d-flex justify-content-left align-items-center">
                                                <i class="material-icons-outlined me-3">
                                                    open_in_new
                                                </i>
                                                <span className="hoverUnderline">Check responses</span>
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {/* <div className="formBox"></div>
                            <div className="formBox"></div>
                            <div className="formBox"></div>
                            <div className="formBox"></div>
                            <div className="formBox"></div> */}
                        </div>
                    </div>
                </div>
            </div>
            {/* <div>
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
            </div> */}
        </div>
    );
}
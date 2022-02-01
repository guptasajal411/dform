import React, { useEffect, useState, useContext } from 'react';
import UserContext from '../context/UserContext';
import domain from "../common/api";

export default  function Dashboard() {
    const [errorMessage, setErrorMessage] = useState();
    const [username, setUsername] = useState();
    const [dashboardData, setDashboardData] = useState([]);
    const {value, setValue} = useContext(UserContext);
    useEffect(() => {
        async function dashboard(){
            if (localStorage.getItem("token")){
            await fetch(domain + "/api/dashboard", {
                    headers: { "x-access-token": localStorage.getItem("token") },
                    method: "GET"
                })
                .then(response => response.json())
                .then((jsonData) => {
                    console.log(jsonData);
                    if (jsonData.status === "ok"){
                        setUsername(jsonData.username);
                        setDashboardData(jsonData.dashboardData);
                        console.log(jsonData);
                    } else {
                        setErrorMessage(jsonData.message);
                    }
                });
            } else {
                // token not available
                setErrorMessage("JWT not available. Please try logging in first.");
            }
        }
        dashboard();
    }, []);
    return (
        <div>
            { username ? <h1>Welcome, {username}</h1> : <h1>Welcome</h1> }
            <hr />
            <div>
                user: {value}
            </div>
            { errorMessage && <p style={{ color: "red" }}>{ errorMessage }</p> }
            { !errorMessage &&
            <div>
                <h1>Your forms</h1>
                <a href="/new">
                    <button>
                        Create a new form ▶
                    </button>
                </a>
                <p>Your total forms: { dashboardData.length }</p>
                { dashboardData.map((formData) => (
                    <div style={{ border: "1px solid red" }}>
                        <h2>{ formData.formTitle }</h2>
                        <p>{ formData.formDescription }</p>
                        <p>Views: { formData.formViews }</p>
                        <p>Submissions: { formData.formSubmissions }</p>
                        <a href={ "/form/" + formData.formSlug }>
                            <button>
                                View this form ▶
                            </button>
                        </a>
                        <a href={ "/responses/" + formData.formSlug }>
                            <button>
                                Responses ▶
                            </button>
                        </a>
                    </div>
                )) }
            </div>
            }
        </div>
    );
}
import React, { useEffect, useState } from 'react'

export default  function Dashboard() {
    // const [verifyResult, setVerifyResult] = useState();
    const [errorMessage, setErrorMessage] = useState();
    const [username, setUsername] = useState();
    const [dashboardData, setDashboardData] = useState([]);
    useEffect(() => {
        async function verify(){
            if (localStorage.getItem("token")){
            await fetch("http://localhost:3001/api/dashboard", {
                    headers: { "x-access-token": localStorage.getItem("token") },
                    method: "POST"
                })
                .then(response => response.json())
                .then((jsonData) => {
                    console.log(jsonData);
                    if (jsonData.status === "ok"){
                        // setVerifyResult(true);
                        setUsername(jsonData.username);
                        setDashboardData(jsonData.dashboardData);
                        console.log(jsonData);
                    } else {
                        // setVerifyResult(false)
                        setErrorMessage(jsonData.message);
                    }
                });
            } else {
                // token not available
                // setVerifyResult(false);
                setErrorMessage("JWT not available. Please try logging in first.");
            }
        }
        verify();
    }, []);
    return (
        <div>
            { username ? <h1>Welcome, {username}</h1> : <h1>Welcome</h1> }
            <hr />
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
                        <a href={ "/forms/" + formData.formSlug }>
                            <button>
                                View this form ▶
                            </button>
                        </a>
                    </div>
                )) }
            </div>
            }
        </div>
    );
}
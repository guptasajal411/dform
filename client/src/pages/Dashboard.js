import React, { useEffect, useState } from 'react'

export default  function Dashboard() {
    const [verifyResult, setVerifyResult] = useState();
    useEffect(() => {
        async function verify(){
            if (localStorage.getItem("token")){
            await fetch("http://localhost:3001/api/verify", {
                    headers: { "x-access-token": localStorage.getItem("token") },
                    method: "POST"
                })
                .then(response => response.json())
                .then((jsonData) => {
                    console.log(jsonData);
                    if (jsonData.status === "ok"){
                        setVerifyResult(true)
                    } else {
                        setVerifyResult(false)
                    }
                });
            } else {
                // token not available
                setVerifyResult(false);
            }
        }
        verify();
    }, []);
    return (
        <div>
            { verifyResult ? <h3>Welcome, username</h3> : <h3>Please sign in before accessing your dashboard.</h3> }
        </div>
    );
}
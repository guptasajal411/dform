export var JWTverifyStatus;

export default async function verify() {
    if (localStorage.getItem("token")){
        await fetch("http://localhost:3001/api/verify", {
            headers: { "x-access-token": localStorage.getItem("token") },
            method: "POST"
        })
        .then(response => response.json())
        .then((jsonData) => {
            console.log(jsonData);
            if (jsonData.status === "ok"){
                JWTverifyStatus = true;
                console.log("JWTverifyStatus: " + JWTverifyStatus);
            } else {
                JWTverifyStatus = false;
                console.log("JWTverifyStatus: " + JWTverifyStatus);
            }
        });
    } else {
        // token not available
        JWTverifyStatus = false;
        console.log("JWTverifyStatus: " + JWTverifyStatus);
    }
}
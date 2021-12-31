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
                return true;
            } else {
                return false;
            }
        });
    } else {
        // token not available
        return false;
    }
}

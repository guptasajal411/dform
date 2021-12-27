const app = require("./routes/routes");
require("dotenv").config();
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log("listening on port: " + PORT);
});
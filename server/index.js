const express = require("express")
const cors = require("cors")
const save_router = require("./routers/save_router")
const fetch_router = require("./routers/fetch_router")

const app = express()
app.use(cors());

app.use("/save", save_router)
app.use("/fetch", fetch_router)

const PORT = process.env.PORT || 8000
app.listen(PORT, () => {
  console.log(`Server is running :${PORT}`);
});
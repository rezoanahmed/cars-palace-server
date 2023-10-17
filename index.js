const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;

// middlewares
app.use(cors())
app.use(express.json())

app.get("/",(req,res)=>{
    const message = "This server is working";
    res.send(message);
})

app.listen(port, ()=>{
    console.log(`Server is running on port: ${port}`);
})
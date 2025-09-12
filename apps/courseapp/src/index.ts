import express, { json }  from "express";
const app = express();

app.post("/puchased/course", (req,res)=>{
    const body = req.body;
    console.log(body);
    res.json({
        message : "succesfully updated"
    })
})

app.listen(3010);
import express from "express";
const app = express();
app.use(express.json());
app.post("/puchased/course", (req,res)=>{
    console.log("hitted")
    const body = req.body;
    console.log(body);
    res.json({
        message : "succesfully updated"
    })
})

app.listen(3010);
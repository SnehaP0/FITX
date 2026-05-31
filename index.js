import express from "express";
import { dirname } from "path";
import bodyParser from "body-parser";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pool from "./db.js";

dotenv.config();
const __dirname=dirname(fileURLToPath(import.meta.url));
const app=express();
const port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({extended:true}));
app.get("/index",(req,res)=>{
res.sendFile(__dirname+"/index.html");
})
async function log(req, res, next) {
    if (req.body) {
        const password = req.body["password"];
        const email = req.body["email"];
        const result = await pool.query(
            'SELECT password FROM users WHERE email = $1',
            [email]
        );
        if (result.rows.length > 0) {
            const dbPassword = result.rows[0].password;
            req.isAuthenticated = (password === dbPassword);
        } else {
            req.isAuthenticated = false;
        }
    }
    next();
}
app.get("/login",(req, res) => {      
  res.sendFile(__dirname + "/login.html");
});
app.post("/login",log,(req,res)=>{
    if(req.isAuthenticated){
        res.redirect("/land");
    }
    else{
        res.redirect("/login");
    }
});
app.get("/sign",(req,res)=>
{
    res.sendFile(__dirname+"/sign.html");
});
app.post("/sign",async (req,res)=>{
    var password=req.body["password"];
    var email=req.body["email"];
    var name=req.body["name"];
    var confirm=req.body["confirm"];
    var age=parseInt(req.body["age"]);
    var bmi=31.23;
    if(age>=18 && password==confirm){
        const quer=await pool.query('INSERT INTO users(email,username,password,age,bmi) VALUES($1,$2,$3,$4,$5)',[email,name,password,age,bmi]);
        res.redirect("/land");
    }
    else{
        res.redirect("/sign");
    }
});
app.get("/meal", (req, res) => {
  res.sendFile(__dirname + "/meal.html");
});

app.get("/work", (req, res) => {
  res.sendFile(__dirname + "/work.html");
});

app.get("/bmi", (req, res) => {
  res.sendFile(__dirname + "/bmi.html");
});
app.get("/logout", (req, res) => {
  res.sendFile(__dirname + "/logout.html");
});
app.get("/nveg", (req, res) => {
  res.sendFile(__dirname + "/nveg.html");
});
app.get("/veg", (req, res) => {
  res.sendFile(__dirname + "/veg.html");
});
app.get("/vegan", (req, res) => {
  res.sendFile(__dirname + "/vegan.html");
});
app.get("/nvegmg", (req, res) => {
  res.sendFile(__dirname + "/nvegmg.html");
});
app.get("/nvegwg", (req, res) => {
  res.sendFile(__dirname + "/nvegwg.html");
});
app.get("/nvegwl", (req, res) => {
  res.sendFile(__dirname + "/nvegwl.html");
});
app.get("/vegmg", (req, res) => {
  res.sendFile(__dirname + "/vegmg.html");
});
app.get("/vegwg", (req, res) => {
  res.sendFile(__dirname + "/vegwg.html");
});
app.get("/vegwl", (req, res) => {
  res.sendFile(__dirname + "/vegwl.html");
});
app.get("/vmg", (req, res) => {
  res.sendFile(__dirname + "/vmg.html");
});
app.get("/vwg", (req, res) => {
  res.sendFile(__dirname + "/vwg.html");
});
app.get("/vwl", (req, res) => {
  res.sendFile(__dirname + "/vwl.html");
});
app.get("/land", (req, res) => {
     res.setHeader('Content-Type', 'text/html');
  res.sendFile(__dirname + "/land.html");
});
app.post("/logout", async (req, res) => {
    const p = req.body["password"];
    const em = req.body["email"];

    const result = await pool.query('SELECT password FROM users WHERE email = $1', [em]);

    if (result.rows.length > 0 && p === result.rows[0].password) {
        res.redirect("/index");
    } else {
        res.redirect("/logout");
    }
});
app.use(express.static(__dirname));

app.listen(port,'0.0.0.0', () => {                  
  console.log(`Server running on http://localhost:${port}`);
});

const express = require('express');
const {MongoClient}=require('mongodb')
const bodyparser=require('body-parser')
var cors = require('cors')
const jwt = require ('jsonwebtoken')
const cookieParser = require('cookie-parser')
const url='mongodb://localhost:27017'
const client=new MongoClient(url)
const dbname='passop';
const app=express()
const port = 3000;
// Middleware to parse JSON bodies
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}))
app.use(bodyparser.json());

client.connect()

// Define a route for the root URL ("/")
app.get('/', async (req, res) => {
    const db=client.db(dbname)
    const collection=db.collection('documents')
    const finalresult= await collection.find({}).toArray();
     //JSON.stringify(finalresult)
    res.json(finalresult);
});

app.post('/search',  async(req, res) => {
    const {location}=req.body;
    const db=client.db(dbname)
    const collection=db.collection('documents')
    const finalresult= await collection.find({location:location}).toArray()
     //JSON.stringify(finalresult)
    res.json(finalresult);
});

app.post('/login', async(req,res)=>{
    const {email,password}=req.body;
    const db=client.db(dbname)
    const collection=db.collection('documents')
    const finalresult= await collection.findOne({email: email})
    .then(user=>{
        if(user){
            if(user.password==password){
               const token=jwt.sign({email: user.email},"jwt-token-secret-key",{expiresIn:'10m'})
               res.cookie('token',token,{httpOnly:true,maxAge:600000}) //httpsOnly - true -js cannot access token
               return res.json("success")
              
            }else{
                res.json("incorrect password")
            }
        }
        else{
            res.json("no recored found")
        }
    })
})

//user register
app.post('/testing', async (req, res) => {
    const password=req.body
    const db=client.db(dbname)
    const collection=db.collection('documents')
    const user= await collection.findOne({email: password.email})
    console.log(user)
    if(!user){
        const finalresult= await collection.insertOne(password)
        res.json("registered successfully")
        //res.send(req.body);
    }
    else{
        res.json("already");
    }
    // .then(async(user)=>{
    //     if(user){
    //         if(user.email==password.email){
    //             res.json("already");
    //         }
           
    //     }
    //     else{
    //         res.json("registered successfully")
    //         const finalresult= await collection.insertOne(password)
    //         res.send(req.body);
    //     }
       
    // })
    // .catch(async(error) => {
    //     console.log("error hai yahan")
    //     const finalresult= await collection.insertOne(password)
    //     res.send(req.body);

    //   });
});


app.post('/guideregister', async (req, res) => {
    const data=req.body
    
    const db=client.db(dbname)
    const collection=db.collection('documents')
    const temp= await collection.findOne({email: data.email})
    .then(async(user)=>{
        if(user){
            res.json("already")
        }
        else{
            const finalresult= await collection.insertOne(req.body)
            res.send(req.body);  
        }
    })
    .catch(async(error) => {
        const finalresult= await collection.insertOne(password)
    
        res.send(req.body);

      });
       
});
// middleware token user
const varifyUser=(req,res,next)=>{
    const atoken=req.cookies.token;
    if(!atoken){
      res.json("Expired Token")
    }else{
        jwt.verify(atoken,"jwt-token-secret-key",(err,decoded)=>{
            if(err){
                return res.json({valid: false, message:"Invalid Token"})
            }
            else{
                req.email=decoded.email
                next()
            }
        })
    }
}

app.get('/home',varifyUser,(req,res)=>{
     res.json({valid:true, message:"authorized"})
})

app.get('/logout',(req,res)=>{
res.clearCookie('token');
res.json({status:true})
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

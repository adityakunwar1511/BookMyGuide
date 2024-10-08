const express = require("express");
const { MongoClient } = require("mongodb");
const bodyparser = require("body-parser");
var cors = require("cors");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");

const url =
  "mongodb+srv://adityakunwar1527:JY3KlxBqWc7occtl@cluster0.w7fp17w.mongodb.net";
const client = new MongoClient(url);
const dbname = "passop";
dotenv.config();
const app = express();
const port = process.env.PORT || 3000;
// Middleware to parse JSON bodies
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(bodyparser.json());

client.connect();
let tokenStorage = {};

// Define a route for the root URL ("/")
app.get("/", async (req, res) => {
  const db = client.db(dbname);
  const collection = db.collection("documents");
  const finalresult = await collection.find({}).toArray();
  //JSON.stringify(finalresult)
  res.json(finalresult);
});

app.post("/search", async (req, res) => {
  const { location } = req.body;
  const db = client.db(dbname);
  const collection = db.collection("documents");
  const finalresult = await collection.find({ location: location }).toArray();
  //JSON.stringify(finalresult)
  res.json(finalresult);
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const db = client.db(dbname);
  const collection = db.collection("documents");
  const finalresult = await collection
    .findOne({ email: email })
    .then((user) => {
      // console.log(user)
      if (user) {
        if (user.password == password) {
          const token = jwt.sign(
            { email: user.email },
            "jwt-token-secret-key",
            { expiresIn: "7d" }
          );
          tokenStorage[user.email] = token;
          // localStorage.setItem('token',JSON.stringify(token));//
          //    res.cookie('token', token,
          //     {
          //         domain:undefined,
          //         maxAge: 60 * 10 * 1000,
          //         secure: process.env.NODE_ENV !== 'development',
          //         sameSite: 'none'
          //     }

          // ) //httpsOnly - true -js cannot access token
          //console.log(token)
          return res.json({ user });
        } else {
          res.json("incorrect password");
        }
      } else {
        res.json("no recored found");
      }
    });
});

//user register
app.post("/testing", async (req, res) => {
  const password = req.body;
  const db = client.db(dbname);
  const collection = db.collection("documents");
  const user = await collection.findOne({ email: password.email });
  //console.log(user)
  if (!user) {
    const finalresult = await collection.insertOne(password);
    res.json("registered successfully");
    //res.send(req.body);
  } else {
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

app.post("/guideregister", async (req, res) => {
  const data = req.body;

  const db = client.db(dbname);
  const collection = db.collection("documents");
  const temp = await collection
    .findOne({ email: data.email })
    .then(async (user) => {
      if (user) {
        res.json("already");
      } else {
        const finalresult = await collection.insertOne(req.body);
        res.send(req.body);
      }
    })
    .catch(async (error) => {
      const finalresult = await collection.insertOne(password);

      res.send(req.body);
    });
});
// middleware token user
const varifyUser = (req, res, next) => {
  const atoken = req.cookies.token;
  // const atoken=localStorage.getItem('token');
  // console.log(atoken)
  // console.log("i run")
  if (!atoken) {
    res.json("Expired Token");
  } else {
    jwt.verify(atoken, "jwt-token-secret-key", (err, decoded) => {
      if (err) {
        return res.json({ valid: false, message: "Invalid Token" });
      } else {
        req.email = decoded.email;
        next();
      }
    });
  }
};

const check = (e) => {
  let atoken = tokenStorage[e];
  if (atoken == null || atoken == undefined) {
    return "Expired Token";
  } else {
    return "valid";
  }
};

app.post("/home", (req, res) => {
  const { userdata } = req.body;
   console.log(userdata.email)
  //console.log(tokenStorage[userdata.email],"hello")
  let ret = check(userdata.email);
  if (ret == "valid") res.json({ valid: true, message: "authorized" });
  else res.json({ valid: false, message: "Invalid Token" });
});

app.post("/profile", (req, res) => {
  // console.log("hitt")
  const { profiledata } = req.body;
  //   console.log(profiledata,"haa")

  let ret = check(profiledata.email);
  if (ret == "valid") res.json({ valid: true, message: "authorized" });
  else res.json({ valid: false, message: "Invalid Token" });
});

app.post("/logout", (req, res) => {
  //res.clearCookie('token');
  const { userdata } = req.body;
  const { profiledata } = req.body;
  let data = null;
  if (userdata == null || userdata == undefined) {
    data = profiledata;
  } else {
    data = userdata;
  }
  // console.log(data.email,"hello email")
  // console.log(tokenStorage[data.email],"hello 1")
  tokenStorage[data.email] = null;
  // console.log(tokenStorage[data.email],"hello 2")
  res.json({ status: true });
});

app.post("/searchpageprotection", (req, res) => {
  const { userdata } = req.body;
  //  console.log(userdata,"haa")

  let ret = check(userdata.email);
  if (ret == "valid") res.json({ valid: true, message: "authorized" });
  else res.json({ valid: false, message: "Invalid Token" });
});

app.post("/book", async (req, res) => {
  const data = req.body;
  // console.log(data)
  const guide = data.e;
  const customer = data.userdata;
  const date = data.date;
  //console.log(date.date)
  const db = client.db(dbname);
  const collection = db.collection("documents");
  const temp = await collection.findOne({ email: guide.email });
  //console.log(temp.booking,"tam temP")
  let finalresult, finalresult1;
  if (temp.customers == undefined) {
    finalresult = await collection.updateOne(
      { email: temp.email },
      {
        $set: {
          customers: [
            {
              email: customer.email,
              name: customer.name,
              payment: "pending",
              date: date.date,
            },
          ],
        },
      }
    );
  } else {
    finalresult = await collection.updateOne(
      { email: temp.email },
      {
        $addToSet: {
          customers: {
            email: customer.email,
            name: customer.name,
            payment: "pending",
            date: date.date,
          },
        },
      }
    );
  }
  const tempc = await collection.findOne({ email: customer.email });
  if (tempc.bookings == undefined) {
    finalresult1 = await collection.updateOne(
      { email: tempc.email },
      {
        $set: {
          bookings: [
            {
              email: guide.email,
              name: guide.name,
              date: date.date,
              location: guide.location,
              rate: guide.rate,
              payment: "pending",
            },
          ],
        },
      }
    );
  } else {
    finalresult1 = await collection.updateOne(
      { email: tempc.email },
      {
        $addToSet: {
          bookings: {
            email: guide.email,
            name: guide.name,
            date: date.date,
            location: guide.location,
            rate: guide.rate,
            payment: "pending",
          },
        },
      }
    );
  }
  const customerdata = await collection.findOne({ email: customer.email });
  // console.log(customerdata)
  res.send(customerdata);
});

//mark as done

app.post("/delete", async (req, res) => {
  const { e, profiledata } = req.body;
  // console.log(e.email,"sapce",profiledata)
  const db = client.db(dbname);
  const collection = db.collection("documents");

  const finalresult1 = await collection.updateOne(
    { email: profiledata.email },
    { $pull: { customers: { email: e.email } } }
  );
  const temp = await collection.findOne({ email: e.email });
  // console.log("temp ",temp)
  const finalresult = await collection.updateOne(
    { email: temp.email },
    { $pull: { bookings: { email: profiledata.email } } }
  );

  await collection.updateOne(
    { email: e.email },
    { $pull: { customers: { email: profiledata.email } } }
  );

  // console.log("temp ",temp)
  await collection.updateOne(
    { email: profiledata.email },
    { $pull: { bookings: { email: e.email } } }
  );
  const t = await collection.findOne({ email: e.email });
  // console.log("i am final",t)
  res.json("deleted");
});

app.post("/api/get-profile", async (req, res) => {
  const { access_token } = req.body;
  const db = client.db(dbname);
  const collection = db.collection("documents");
  try {
    // Use fetch instead of axios
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
          Accept: "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching profile data");
    }

    const data = await response.json();
    const { email, name } = data;

    const user = await collection.findOne({ email: email });

    if (user) {
      const token = jwt.sign({ email: user.email }, "jwt-token-secret-key", {
        expiresIn: "7d",
      });
    //  console.log(user.email,"here")
      tokenStorage[user.email] = token;
    //  console.log(tokenStorage[email],"here")
    } else {
      const token = jwt.sign({ email:email }, "jwt-token-secret-key", {
        expiresIn: "7d",
      });
      tokenStorage[email] = token;
      const finalresult = await collection.insertOne({
        email,
        name,
        password: "12345",
      });
    }
   
    return res.json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error fetching profile" });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});

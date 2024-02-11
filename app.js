if(process.env.NODE_ENV != "production")
{
  require('dotenv').config();
}

const express=require("express");
const app=express();
const mongoose = require('mongoose');
const path=require("path");
const methodOverride= require("method-override");
const ejsMate= require("ejs-mate");
const ExpressError=require("./utils/ExpressError.js");
const session = require("express-session");
// const MongoStore = require("connect-mongo");
const MongoDBStore = require('connect-mongodb-session')(session);
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");
const port=3000;



const listingsRouter = require("./routes/listing.js");
const reviewsRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const { error } = require('console');

//const MONGO_URL ='mongodb://127.0.0.1:27017/wanderweb';
const dbUrl = process.env.ATLASDB_URL
main()
.then(()=>
{
    console.log("connecting to DB");
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);

}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));


// const store = new MongoDBStore({
//   mongoUrl:dbUrl,
//   crypto: {
//     secret:"mysupercode"
//   },
//   touchAfter:24*3600,
// });

// store.on("error", (err)=> {
//   console.log("Err in mongo store", err);
// })


const store = new MongoDBStore({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24 *3600,
});

store.on("error",(err)=>
{
  console.log("ERROR in mongo store",err);
})

const sessionOptions = {
  store,
  secret:process.env.SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Set expiration time using Date object
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true
  },
};

// app.get("/",(req,res)=>
// {
//     res.send("hi");
// })


app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use((req,res,next)=>
{
  res.locals.success =req.flash("success");
  res.locals.error =req.flash("error");
  res.locals.currUser =req.user;
  next();
})


// app.get("/demouser",async(req,res)=>
// {
//   let fakeUser = new User({
//     email:"student@gmail.com",
//     username :"delta-student"
//   });
//  let registeredUser =await User.register(fakeUser,"helloworld");
//  res.send(registeredUser);
// })

app.use("/listings",listingsRouter);
app.use("/listings/:id/reviews",reviewsRouter);
app.use("/",userRouter);

app.all("*",(req,res,next)=>
{
  next(new ExpressError(404,"Page Not Found"));
})

app.use((err,req,res,next)=>
{
  let {statusCode=500,message="Something went wrong!"}=err;
  res.status(statusCode).render("./listings/error.ejs",{message});
  // res.status(statusCode).send(message);
});

app.listen(port,()=>
{
    console.log(`listing to port ${port}`);
})
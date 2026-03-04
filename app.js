const express = require("express")

const app = express()

require("dotenv").config()


const mongoose = require("mongoose")

const path = require('path')

const methodOverride = require("method-override")

const ejsMate = require('ejs-mate')

const ExpressError = require('./utils/ExpressError')

const routerlistings = require('./routes/listing.js')

const routerreviews = require('./routes/review.js')

const routerUser=require('./routes/user.js')

const session = require("express-session")

const MongoStore = require('connect-mongo');

const flash = require('connect-flash')

const passport=require('passport')

const localStartegy=require('passport-local')

const User=require('./models/user.js')



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride("_method"));

app.engine('ejs', ejsMate)

app.use(express.static(path.join(__dirname, "/public"))) //static file serve
app.use('/uploads', express.static(path.join(__dirname, "/uploads"))) //serve uploaded files

const port = 8080

// const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const db_url = process.env.ATLASDB_URL;

main().then(() => {
    console.log("connected to the DB")
}).catch((err) => {
    console.log(err)
})

async function main() {
    await mongoose.connect(db_url, {
        serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
        socketTimeoutMS: 45000, // Socket timeout
    });
}

const store = new MongoStore({
    mongoUrl: db_url,
    touchAfter: 24 * 3600,
   
});

store.on("error", (err) => {
    console.log("ERROR in mongo session store:", err);
});

const sessionOptions = {
    store: store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}



// app.get("/", (req, res) => {
//     res.send("hey!! I am inside the root")
// })

app.use(session(sessionOptions))
app.use(flash())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new localStartegy(User.authenticate()))

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// app.get("/demouser",async(req,res)=>{

//  let fakeUser= new User({
//     email:"newUser@gmail.com",
//     username:"student"
//  })

//  let registeredUser=await User.register(fakeUser,"helloworld")
//  res.send(registeredUser)

// })



app.use((req, res, next) => {
    res.locals.success = req.flash("success") || []
    res.locals.error = req.flash("error") || []
    res.locals.currUser = req.user || null
    res.locals.searchQuery = req.query.search || ''
    next()
})

// Root route - redirect to listings page
app.get('/', (req, res) => {
    res.redirect('/listings');
});

app.use("/listings", routerlistings)
app.use("/listings/:id/reviews", routerreviews)
app.use("/",routerUser)


app.all("*path", (req, res, next) => {
    console.log(`PAGE NOT FOUND: ${req.method} ${req.originalUrl}`);
    next(new ExpressError(404, "PAGE NOT FOUND!!"))
})

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "SOMETHING MISCLANEOUS THERE-->>" } = err
    // res.status(statusCode).send(message)

    res.status(statusCode).render('error.ejs', { err })
    // res.send("Something going wrong!!")
})


app.listen(port, () => {
    console.log(`listening to port ${port}`)
})


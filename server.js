const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const morgan = require("morgan");
const path = require("path");
const session = require('express-session');

const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on("connected", () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

// Middleware
app.use(express.static(path.join(__dirname, "public")));

const Candidate = require("./models/candidate.js");
const Recruiter = require("./models/recruiter.js");

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(morgan('dev'));
//SESSION
app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    })
  );

const authController = require("./controllers/auth.js");

app.use("/auth", authController);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Routes
app.get("/", async (req, res) => {
  res.render("index.ejs");
});

app.get("/auth/candidate-sign-up", async (req, res) => {
  res.render("auth/candidate-sign-up.ejs"); // Fixed route
});

app.get("/auth/candidate-sign-in", async (req, res) => {
    res.render("auth/candidate-sign-in.ejs"); // Fixed route
  });

  app.get("/auth/recruiter-sign-up", async (req, res) => {
    res.render("auth/recruiter-sign-up.ejs"); // Fixed route
  });

  app.get("/auth/recruiter-sign-in", async (req, res) => {
    res.render("auth/recruiter-sign-in.ejs"); // Fixed route
  });

  app.get("/candidate/profile/:candidateId", async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.candidateId);
        
        if (!candidate) {
            return res.status(404).send("Candidate not found");
        }

        res.render("candidate/candidate-profile.ejs", { // Make sure this is the correct template
            candidate: candidate,
            sessionCandidate: req.session.candidate
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});




  app.get("/candidate/home/:candidateId", async (req, res) => {
    try {
        const candidate = await Candidate.findById(req.params.candidateId);
        res.render("candidate/candidate-home.ejs", {
            candidate: candidate, 
            sessionCandidate: req.session.candidate 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
});

  app.get("/recruiter/home", async (req, res) => {
    try {
        const recruiter = await Recruiter.findOne(); recruiter
        res.render("recruiter/recruiter-home.ejs", { 
            recruiter: recruiter || req.session.recruiter 
        });
    } catch (error) {
        console.error("Error fetching recruiter:", error);
        res.status(500).send("Internal Server Error");
    }
});


app.delete("/candidate/profile/:candidateId", async (req, res) => {
  await Candidate.findByIdAndDelete(req.params.candidateId);
  res.redirect("/");
});

app.put("/candidate/profile/:candidateId", async (req, res) => {
  await Candidate.findByIdAndUpdate(req.params.candidateId, req.body);
  res.redirect(`/candidate/profile/${req.params.candidateId}`);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

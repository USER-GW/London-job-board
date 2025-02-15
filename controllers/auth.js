const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const Candidate = require("../models/candidate.js");
const Recruiter = require("../models/recruiter.js");

// Candidate sign-up route path
router.get("/candidate-sign-up", (req, res) => {
  res.render("auth/candidate-sign-up.ejs");
});

router.post("/candidate-sign-up", async (req, res) => {
  try {
    const userInDatabase = await Candidate.findOne({ email: req.body.email });
    if (userInDatabase) {
      return res.send("Email already in use");
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password must match");
    }

    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create user with hashed password
    const candidate = await Candidate.create({ 
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email, 
      password: hashedPassword 
    });

    // Store candidate in session
    req.session.candidate = candidate; 

    // Redirect to the home page with candidateId
    res.redirect(`/candidate/home/${candidate._id}`);
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).send("An error occurred. Please try again.");
  }
});

// Recruiter sign-up route path
router.post("/recruiter-sign-up", async (req, res) => {
  try {
    const userInDatabase = await Recruiter.findOne({ email: req.body.email});
    if (userInDatabase) {
      return res.send("Email already in use");
    }

    if (req.body.password !== req.body.confirmPassword) {
      return res.send("Password and Confirm Password must match");
    }

    // Hash the password asynchronously
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    // Create user with hashed password
    const recruiter = await Recruiter.create({ 
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email, 
      company: req.body.company,
      password: hashedPassword 
    });

    res.send(`Thanks for signing up ${recruiter.firstname}`);
  } catch (error) {
    console.error("Error during sign-up:", error);
    res.status(500).send("An error occurred. Please try again.");
  }
});

// Candidate sign-in route path
router.get("/candidate-sign-in", (req, res) => {
  res.render("auth/candidate-sign-in.ejs");
});

router.post("/candidate-sign-in", async (req, res) => {
  try {
    const userInDatabase = await Candidate.findOne({ email: req.body.email });
    if (!userInDatabase) {
      return res.render("auth/candidate-sign-in.ejs", { error: "Login failed. Please try again." });
    }

    const validPassword = bcrypt.compareSync(req.body.password, userInDatabase.password);
    if (!validPassword) {
      return res.render("auth/candidate-sign-in.ejs", { error: "Login failed. Please try again." });
    }

    // Storing the candidate's email and _id in session
    req.session.email = { 
      email: userInDatabase.email,
      _id: userInDatabase._id
    };

    // Redirecting to the candidate's home page
    res.redirect(`/candidate/home/${userInDatabase._id}`);
  } catch (error) {
    console.error("Error during sign-in:", error);
    res.status(500).send("An error occurred. Please try again.");
  }
});

// Recruiter sign-in route path
router.get("/recruiter-sign-in", (req, res) => {
  res.render("auth/recruiter-sign-in.ejs");
});

router.post("/recruiter-sign-in", async (req, res) => {

const userInDatabase = await Recruiter.findOne({ email:req.body.email });
if (!userInDatabase) {
  return res.send("Login failed. Please try again.");
}
const validPassword = bcrypt.compareSync(
  req.body.password,
  userInDatabase.password
);
if (!validPassword) {
  return res.send("Login failed. Please try again.");
}

req.session.email = {
  email: userInDatabase.email,
  _id: userInDatabase._id
};
res.redirect("/recruiter/home");
});

module.exports = router;
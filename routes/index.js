var express = require("express");
var router = express.Router();
const userModel = require("./users");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* GET Login page */
router.get("/", function (req, res) {
  res.render("index", { message: null });
});

// get signup page
router.get("/signup", function (req, res) {
  res.render("signup", {message : null});
});

// get home page
router.get("/home", isLoggedIn, async (req, res) => {
  let token = req.cookies.token;
  let data = jwt.verify(token, "a2@*@#*@&#@*&#YJBNDFJSHDUE");
  let email = data.email;

  const user = await userModel.findOne({ email: email });
  res.render("home", { user });
});

// it will login user to his account
router.post("/login", async function (req, res) {
  let user = await userModel.findOne({ email: req.body.email });
  if (!user)
    return res.render("index", { message: "Email or Password is wrong" });

  bcrypt.compare(req.body.password, user.password, function (err, result) {
    if (err) return res.send(err);
    if (result) {
      let token = jwt.sign({ email: user.email }, "a2@*@#*@&#@*&#YJBNDFJSHDUE");
      res.cookie("token", token);
      res.redirect("/home");
    } else {
      res.render("index", { message: "Email or Password is wrong" });
    }
  });
});

// it will logout the user from account
router.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
});

// POST Signup route
router.post("/register", async function (req, res) {
  let { email, password } = req.body;
  let userExist = await userModel.findOne({ email: email });
  if (userExist) {
    return res.render("signup", { message: "Try another Email and Password." });
  }
  let createdUser = null;

  try {
    bcrypt.genSalt(10, (err, salt) => {
      bcrypt.hash(password, salt, async (err, hash) => {
        if (err) {
          console.error(err);
          return;
        }
        createdUser = await userModel.create({
          email: email,
          password: hash,
        });
      });
    });

    // create JWT token
    let token = jwt.sign({ email }, "a2@*@#*@&#@*&#YJBNDFJSHDUE");

    res.cookie("token", token);

    res.render("home", {email});
  } catch (err) {
    console.error(err);
    res.status(500).send("Error in registration");
  }
});

// it will also check user is login or not
async function isLoggedIn(req, res, next) {
  const token = req.cookies.token; // yahi use karo
  if (!token) return res.redirect("/");

  try {
    const data = jwt.verify(token, "a2@*@#*@&#@*&#YJBNDFJSHDUE");
    let email = data.email;
    let existUser = await userModel.find({ email: email });
    if (existUser) {
      return next();
    } else {
      console.log("User not exist");
    }
  } catch (err) {
    return res.status(401).send("Invalid token");
  }
}

// create new notes
router.post("/createnotes", async (req, res) => {
  const { description, notes } = req.body;
  try {
    let token = req.cookies.token;
    let data = jwt.verify(token, "a2@*@#*@&#@*&#YJBNDFJSHDUE");
    let email = data.email;

    const user = await userModel.findOne({ email: email });

    user.notes.push({
      description: description,
      noteData: notes,
    });
    await user.save();

    return res.json({
      success: true,
      description: description,
      noteData: notes,
      date: new Date().toISOString().slice(0, 10),
      scroll: true,
    });
  } catch (err) {
    return res.json({
      success: false,
      error: err,
    });
  }
});

// router that delete note
router.post("/deletenote", async (req, res) => {
  const noteid = req.body.noteid;
  if (!noteid) return res.json({ success: false, error: "NoteId not found" });
  try {
    let token = req.cookies.token;
    let data = jwt.verify(token, "a2@*@#*@&#@*&#YJBNDFJSHDUE");
    let email = data.email;

    const user = await userModel.findOne({ email: email });

    if (user.notes.indexOf(user.notes.id(noteid)) !== -1) {
      user.notes.splice(user.notes.indexOf(user.notes.id(noteid)), 1);
      await user.save();

      return res.json({
        success: true,
      });
    } else {
      return res.json({
        success: false,
        error: "Index not found",
      });
    }
  } catch (err) {
    return res.json({
      success: false,
      error: err,
    });
  }
});

// router that open edit page
router.get("/edit/:noteid", async function (req, res) {
  try {
    let token = req.cookies.token;
    let data = jwt.verify(token, "a2@*@#*@&#@*&#YJBNDFJSHDUE");
    let email = data.email;

    const user = await userModel.findOne({ email: email });

    const noteid = req.params.noteid;

    const note = user.notes.id(noteid);

    res.render("edit", { note });
  } catch (err) {
    console.error(err);
  }
});

// save changes router
router.post("/savechanges", async function (req, res) {
  try {
    const noteid = req.body.noteid;
    const notedata = req.body.notedata;
    const desc = req.body.desc;

    let token = req.cookies.token;
    let data = jwt.verify(token, "a2@*@#*@&#@*&#YJBNDFJSHDUE");
    let email = data.email;

    const user = await userModel.findOne({ email: email });

    const note = user.notes.id(noteid);
    let index = user.notes.indexOf(note);

    user.notes[index].description = desc;
    user.notes[index].noteData = notedata;
    await user.save();

    return res.json({ redirect: "/home" });
  } catch (err) {
    console.error(err);
  }
});

// search note
router.get("/search/:input", async function (req, res) {
  const input = req.params.input;

  let token = req.cookies.token;
  let data = jwt.verify(token, "a2@*@#*@&#@*&#YJBNDFJSHDUE");
  let email = data.email;

  const user = await userModel.findOne({ email });

  const regex = new RegExp(input, "i");

  const note = user.notes.filter(n => regex.test(n.description));


  res.render("home", {user : {notes : note}});
});


module.exports = router;

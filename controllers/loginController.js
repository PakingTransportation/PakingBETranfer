const passport = require("passport");
const User = require('../models/User');
const bcrypt = require('bcryptjs')

const registerUser = (req, res) => {
  const { name, email, location, password, confirm } = req.body;
  console.log("🚀 ~ registerUser ~ req.body:", req)
  console.log("🚀 ~ registerUser ~ name:", name)

  if (!name || !email || !password || !confirm) {
    console.log("Fill empty fields");
  }

  //Confirm Passwords
  if (password !== confirm) {
    console.log("Password must match");
  } 
  else {
    //Validation
    User.findOne({ email: email }).then((user) => {
      if (user) {
        console.log("email exists");
        res.render("register", {
          name,
          email,
          password,
          confirm,
        });
      } else {
        //Validation
        const newUser = new User({
          name,
          email,
          location,
          password,
        });
        //Password Hashing
        bcrypt.genSalt(10, (err, salt) =>
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            console.log("🚀 ~ bcrypt.hash ~ hash:", hash)
            if (err) {
              console.log("🚀 ~ bcrypt.hash ~ err:", err)
              // throw err;
            }

            newUser.password = hash;
            newUser
              .save()
              .then(res.redirect("/login"))
              .catch((err) => console.log(err));
          })
        );
      }
    });
  }
};


//For register page
const registerView = (req, res) => {
    res.render("register", { 
    });
}

const loginUser = (req, res) => {
  const {email, password} = req.body

  if(!email || !password){
    console.log('Please fill in all the fields')
    res.render('login', {email, password})
  }
  else {
    passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/login',
      failureFlash: true
    })(req, res)
  }
}

//For views
const loginView = (req, res) => {
    res.render("login", {});
}

const homeView = (req, res) => {
  res.render("home", {})
}

module.exports= {
    registerView,
    loginView,
    registerUser,
    loginUser,
    homeView
};
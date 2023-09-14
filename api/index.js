const express = require("express");
const bodyParser = require("body-parser");
const { default: mongoose } = require("mongoose");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;

const app = express();
const port = 8000;
const cors = require("cors");
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
const jwt = require("jsonwebtoken");

mongoose
  .connect("mongodb+srv://jodduser:jodduser@cluster0.hd4qsmk.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log("Error connecting to MongoDB", err);
  });

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const User = require("./models/user");
const Message = require("./models/message");

//function to create a token for the user
const createToken = (userId) => {
  //set the token payload
  const payload = {
    userId: userId,
  };
  //sign the token
  return jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", {
    expiresIn: 3600,
  });
};

//endpoint for registration of user

app.post("/register", (req, res) => {
  const { name, email, password, image } = req.body;

  //create a new user object
  const newUser = new User({ name, email, password, image });

  //save the user to the database
  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "User registered successfully" });
    })
    .catch((err) => {
      console.log("Error registering the user", err);
      res.status(500).json({ message: "Error registering user" });
    });
});

//endpoint for login of the user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  //check if the email and password are provided
  if (!email || !password) {
    return res.status(404).json({ message: "email and password are required" });
  }

  //check for that user in the database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        //user not found
        return res.status(404).json({ message: "User not found" });
      }
      //check if the password matches
      if (user.password != password) {
        return res.status(404).json({ message: "Invalid Password" });
      }
      //if the password matches, create a token
      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch((err) => {
      console.log("Error in finding the user");
      res.status(500).json({ message: "Internal server error !" });
    });
});

//endpoint to access all the users expect the user who is currently logged in

app.get("/users/:userId", (req, res) => {
  const loggedInUserId = req.params.userId;
  User.find({ _id: { $ne: loggedInUserId } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((error) => {
      console.log("Error retrieving users", error);
      res.status(500).json({ message: "error retrieving users" });
    });
});

//endpoint to send a request to a user
app.post("/friend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    //update the recipient's friendRequests array
    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId },
    });

    //update the sender's sentFriendRequests array
    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log("Error sending friend request", error);
    res.sendStatus(500);
  }
});

//endpoint to show all the friend-requests of a particular user

app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user document based on the User ID
    const user = await User.findById(userId)
      .populate("friendRequests", "name email image")
      .lean();

    const friendRequests = user.friendRequests;

    res.json(friendRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to accept a friend request

app.post("/accept-friend-request", async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    //fetch the user document of sender and recipient
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    sender.friends.push(recipientId);
    recipient.friends.push(senderId);

    recipient.friendRequests = recipient.friendRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );
    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recipientId.toString()
    );

    await sender.save();
    await recipient.save();
    res.status(200).json({ message: "Friend req accepted successfully!" });
  } catch (error) {
    console.log("Error accepting friend request", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

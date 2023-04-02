import express from "express";
import mongoose from "mongoose";

const app = express();
const port = 3000;

app.use(express.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

await mongoose.connect(
  "mongodb+srv://harshs893:Hks_8999@cluster0.igm71gc.mongodb.net/?retryWrites=true&w=majority"
);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("Database connected!");
});

const userSchema = new mongoose.Schema({
  email: String,
  firstName: String,
});
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.send("Harsh Kamlesbhai Shah (B00899573) - Welcome to Tutorial 5");
});

app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      success: true,
      data: users,
      message: "User retrieved",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "User not retrieved: " + error.message,
    });
  }
});

app.put("/users/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.post("/add", async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      firstName: req.body.firstName,
    });
    await user.save();
    res.status(201).json({
      success: true,
      data: user,
    });
  
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user && req.params.id === undefined) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    user: {
      email: user.email,
      firstName: user.firstName,
      id: user.id,
    },
  });
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

app.use(function (req, res, next) {
  res.status(404).json({
    success: false,
    message: "Endpoint not found",
  });
});

app.listen(port, () => console.log(`Tutorial 5 is listening on port ${port}!`));

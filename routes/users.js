// models/User.js
const mongoose = require("mongoose");

// mongoose
//   .connect("mongodb://127.0.0.1:27017/NotesWebApp")
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("DB Connected"))
  .catch((err) => console.log(err));



  const noteSchema = new mongoose.Schema(
  {
    description: String,
    noteData: String
  },
  { timestamps: true }   // har note ka createdAt & updatedAt
);




const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    notes: [noteSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);

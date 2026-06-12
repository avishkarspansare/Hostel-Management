const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Atlas Connected"))
  .catch((err) => console.log(err));

const studentSchema = new mongoose.Schema({
  name: String,
  email: String
});

const Student = mongoose.model("Student", studentSchema);

// CREATE
app.post("/students", async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
});

// READ
app.get("/students", async (req, res) => {
  const students = await Student.find();
  res.json(students);
});

// UPDATE
app.put("/students/:id", async (req, res) => {
  const student = await Student.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(student);
});

// DELETE
app.delete("/students/:id", async (req, res) => {
  await Student.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted Successfully" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server Running`);
});
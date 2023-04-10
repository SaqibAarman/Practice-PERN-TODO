const express = require("express");
const app = express();
const cors = require("cors");

//require db connection
const pool = require("./db");

const port = process.env.port || 3000;

//middleWare
app.use(cors());
app.use(express.json());

// -------------------------- Routes ------------------//

//Create Todo
app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
  }
});

//GET All TODO's
app.get("/todos", async (req, res) => {
  try {
    const allTodo = await pool.query("SELECT * FROM todo");
    res.json(allTodo.rows);
  } catch (err) {
    console.log(err.message);
  }
});

//GET Todo By It's ID
app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id,
    ]);
    res.json(todo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//UPDATE A Todo By It's ID
app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );
    res.json("Todo Was Updated...");
    //res.json(updateTodo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

//DELETE Todo's By It's ID
app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1",
      [id]
    );
    res.json("Todo Was Deleted...");
    //res.json(deletedTodo.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(port, () => {
  console.log(`Connected To Server ${port}`);
});

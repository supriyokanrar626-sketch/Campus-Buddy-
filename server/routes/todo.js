import express from "express";
import { createTodo, deleteTodo, getAllTodos, updateTodo } from "../controllers/todo.js";
import isAuthenticated from "../middleware/isAuthentication.js";

const router = express.Router();

router.route("/").post(isAuthenticated, createTodo).get(getAllTodos); // 1
// router.route("/").get(getAllTodos);

router.route("/:todoId").put(isAuthenticated, updateTodo).delete(deleteTodo); // 2

// router.route("/").delete(deleteTodo); // 3

export default router;
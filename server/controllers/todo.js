import { Todo } from "../models/todo.js";
export const createTodo = async (req, res) => {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({
                success: false,
                message: "Fill every data.."
            })
        }
        const todo = new Todo({ title, description });
        await todo.save();

        return res.status(201).json({
            success: true,
            message: "Todo Created nicely..",
            todo,
        })
    } catch (error) {
        console.log(error);
    }
}

export const getAllTodos = async (req, res) => {
    try {
        const todos = await Todo.find();

        return res.status(201).json({
            success: true,
            message: "All todos are here..",
            todos
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateTodo = async (req, res) => {
    try {
        const todoId = req.params.todoId;
        const { title, description } = req.body;
        // console.log(title);

        // const todo = await Todo.findyById(todoId) ;
        const todo = await Todo.findByIdAndUpdate(todoId, { title, description }, { new: true });
        await todo.save();

        return res.status(200).json({
            success: true,
            message: "Todo Update successful..",
            todo
        })
    } catch (error) {
        console.log(error);
    }
}

export const deleteTodo = async (req, res) => {
    try {
        const todoId = req.params.todoId;
        const todo = await Todo.findByIdAndDelete(todoId);

        return res.status(200).json({
            success: true,
            message: "Todo deleted .."
        })
    } catch (error) {
        console.log(error);
    }
}
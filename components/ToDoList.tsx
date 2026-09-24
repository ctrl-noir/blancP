import { useState } from "react";
import { CheckCircle, Trash2, Plus } from "lucide-react";

function TodoList() {
  const [todos, setTodos] = useState<string[]>([
    "Finish coding assignment",
    "Read 20 pages of book",
  ]);
  const [newTodo, setNewTodo] = useState("");

  const addTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos([...todos, newTodo]);
      setNewTodo("");
    }
  };

  const removeTodo = (index: number) => {
    setTodos(todos.filter((_, i) => i !== index));
  };

  return (
<>
    <h2 className="font-bold text-gray-400 text-lg border-zinc-700">
    To‑Do List
    </h2>
    <p className="font-semibold text-xs text-gray-500">task that need to be done.</p>
    <div className="flex items-center gap-2 mt-3">
        <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-3 py-2 rounded-md bg-zinc-800 text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={addTodo}>
            <Plus className=" ml-auto w-auto h-7 mr-3 bg-green-700 rounded-md" strokeWidth={3} size={16} /> 
        </button>
    </div>

    {/* List of todos */}
    <ul className="mt-4 flex flex-col gap-2">
    {todos.map((todo, idx) => (
        <li
        key={idx}
        className="flex items-center justify-between bg-zinc-700 rounded-md px-3 py-2 text-gray-200 text-sm shadow-sm"
        >
        <div className="flex items-center gap-2">
            <CheckCircle className="text-white-500" size={16} />
            <span className="font-bold text-white-200">{todo}</span>
        </div>
        <button
            onClick={() => removeTodo(idx)}
            className="text-white hover:text-red-600"
        >
            <Trash2 size={16} />
        </button>
        </li>
    ))}
    </ul>
</>  
  );
}

export default TodoList;

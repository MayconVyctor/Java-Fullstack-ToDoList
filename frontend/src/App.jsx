import { useState, useEffect } from "react";  
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => { 
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  return (
    <div className="Container mt-5">
      <h1 className= "text-center mb-4 ">To-Do List (React + Spring)</h1>

      <div className="list-group">
        {/* 4. O .map() percorre a lista de tarefas e cria um item HTML para cada uma */}
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <div key={task.id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">{task.title}</h5>
                <small className="text-muted">{task.status? task.status : "Nenhum status definido"}</small>
              </div>
              <span className="badge bg-primary rounded-pill">ID: {task.category.name}</span>
            </div>
          ))
        ) : (
          <p className="text-center">Nenhuma Tarefa encontrada no banco, Adicione algo via Adminer.</p>
        )}
      </div>
            </div>
  );
}

export default App;
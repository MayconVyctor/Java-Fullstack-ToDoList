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
    <div>
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <div key={task.id} className="card border-0 shadow-sm mb-3">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <h6 className="fw-bold mb-1">{task.title}</h6>
                <span className="badge rounded-pill bg-primary me-2">
                   {task.category?.name || "Sem Categoria"}
                </span>
                <span className="text-muted small">{task.status || "Pendente"}</span>
              </div>
              <div className="actions">
                 <button className="btn btn-sm btn-outline-success me-2">✓</button>
                 <button className="btn btn-sm btn-outline-danger">✕</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center">Nenhuma Tarefa encontrada no banco, Adicione algo via Adminer.</p>
      )}
    </div>
  );
}

export default App;
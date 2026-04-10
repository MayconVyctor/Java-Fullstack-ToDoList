import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => { 
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const taskResponse = await axios.get("http://localhost:8080/api/tasks");
      setTasks(taskResponse.data);

      try {
        const categoriesRes = await axios.get("http://localhost:8080/api/categories");
        setCategories(Array.isArray(categoriesRes.data) ? categoriesRes.data : []);
      } catch (catError) {
        console.warn("⚠️ Endpoint de categorias não encontrado.");
        setCategories([]);
      }
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      alert("Não foi possível conectar ao backend.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      const response = await axios.post("http://localhost:8080/api/tasks", {
        title: newTaskTitle,
        categoryId: categories[0]?.id || null
      });
      setTasks([...tasks, response.data]);
      setNewTaskTitle("");
    } catch (error) {
      console.error("Erro ao criar tarefa:", error);
      alert("Não foi possível criar a tarefa.");
    }
  };

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    try {
      const response = await axios.post("http://localhost:8080/api/categories", {
        name: newCategoryName,
        color: "#" + Math.floor(Math.random()*16777215).toString(16)
      });
      setCategories([...categories, response.data]);
      setNewCategoryName("");
    } catch (error) {
      console.error("Erro ao criar categoria:", error);
      alert("Não foi possível criar categoria.");
    }
  };

  const handleToggleTask = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/tasks/${id}/toggle`);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    } catch (error) {
      console.error("Erro ao atualizar:", error);
      setTasks(prev => prev.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm("Excluir?")) return;
    try {
      await axios.delete(`http://localhost:8080/api/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error("Erro ao excluir:", error);
    }
  };

  const filteredTasks = selectedCategory
    ? tasks.filter(task => task.category?.id === selectedCategory)
    : tasks;

  if (loading) {
    return (
      <div style={{minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg, #667eea, #764ba2)'}}>
        <div style={{background:'rgba(255,255,255,0.95)', padding:'2rem', borderRadius:'16px', textAlign:'center', boxShadow:'0 8px 32px rgba(0,0,0,0.1)'}}>
          <div style={{fontSize:'2.5rem', marginBottom:'1rem'}}>⏳</div>
          <p>Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <aside className="sidebar">
        {/* Form Categoria */}
        <div className="glass-card">
          <h3>📁 Nova Categoria</h3>
          <form onSubmit={handleAddCategory}>
            <input 
              type="text" 
              placeholder="Nome da categoria..."
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              style={{width:'100%', marginBottom:'0.75rem'}}
            />
            <button type="submit" className="btn-primary" style={{width:'100%'}}>
              Criar Categoria
            </button>
          </form>
        </div>

        {/* Lista Categorias */}
        <div className="glass-card">
          <h3>🏷️ Categorias</h3>
          <div 
            className={`category-item ${selectedCategory === null ? 'active' : ''}`}
            onClick={() => setSelectedCategory(null)}
            style={{cursor:'pointer', padding:'0.5rem', borderRadius:'8px', marginBottom:'0.5rem'}}
          >
            Todas
          </div>
          {categories.map(cat => (
            <div
              key={cat.id}
              className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                cursor:'pointer', 
                padding:'0.5rem', 
                borderRadius:'8px', 
                marginBottom:'0.5rem',
                background: selectedCategory === cat.id ? 'rgba(108, 92, 231, 0.1)' : 'transparent'
              }}
            >
              <span style={{
                display:'inline-block', 
                width:'12px', 
                height:'12px', 
                borderRadius:'50%', 
                background: cat.color || '#6c5ce7',
                marginRight:'8px'
              }}></span>
              {cat.name}
            </div>
          ))}
        </div>

        {/* Form Tarefa */}
        <div className="glass-card">
          <h3>➕ Nova Tarefa</h3>
          <form onSubmit={handleAddTask}>
            <input 
              type="text" 
              placeholder="O que fazer?"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              style={{width:'100%', marginBottom:'0.75rem'}}
            />
            <button type="submit" className="btn-primary" style={{width:'100%'}}>
              Salvar Tarefa
            </button>
          </form>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="content">
        <header style={{marginBottom:'24px'}}>
          <h2 style={{fontSize:'2rem', color:'white'}}>Minhas Tasks</h2>
          <p style={{color:'rgba(255,255,255,0.9)'}}>
            Você tem <strong>{filteredTasks.filter(t => !t.completed).length}</strong> atividades pendentes.
          </p>
        </header>

        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="task-item shadow">
              <div>
                <h4 style={{margin:'0 0 8px 0'}}>{task.title}</h4>
                <div style={{display:'flex', gap:'10px', alignItems:'center'}}>
                  <span className="category-tag">
                    {task.category?.name || "Geral"}
                  </span>
                  <span style={{fontSize:'0.8rem', color:'var(--text-muted)'}}>
                    {task.completed ? "Concluída" : "Pendente"}
                  </span>
                </div>
              </div>
              <div className="actions">
                <button 
                  style={{border:'none', background:'none', cursor:'pointer', fontSize:'1.2rem', opacity:0.7}}
                  onClick={() => handleToggleTask(task.id)}
                >
                  {task.completed ? "↩️" : "✅"}
                </button>
                <button 
                  style={{border:'none', background:'none', cursor:'pointer', fontSize:'1.2rem', opacity:0.7}}
                  onClick={() => handleDeleteTask(task.id)}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card" style={{textAlign:'center', padding:'60px'}}>
            <p style={{color:'var(--text-muted)'}}>🌱 Nenhuma tarefa por enquanto.</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
package com.projetoTodolist.service;

import com.projetoTodolist.model.Task;
import com.projetoTodolist.repository.TaskRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public List<Task> findAllTasks() {
        return taskRepository.findAll();
    }
    
    public Task save(Task task) {
        if (task.getStatus() == null) {
            task.setStatus("Nova");
        }
        return taskRepository.save(task);
    }

    public Optional<Task> findById(Long id) {
        return taskRepository.findById(id);
    }
    public void deleteById(Long id) {
        taskRepository.deleteById(id);
    }
}

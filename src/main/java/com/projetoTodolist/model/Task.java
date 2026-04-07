package com.projetoTodolist.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@Entity
@Table(name = "tb_task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "O título é obrigatório")
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String status; 

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category; 
}
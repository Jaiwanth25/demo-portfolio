package com.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "projects")
public class Project {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 300)
    private String technologies;

    @Column(length = 300)
    private String github;

    public Project() {}

    public Project(String title, String description, String technologies, String github) {
        this.title = title;
        this.description = description;
        this.technologies = technologies;
        this.github = github;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getTechnologies() { return technologies; }
    public void setTechnologies(String technologies) { this.technologies = technologies; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }
}

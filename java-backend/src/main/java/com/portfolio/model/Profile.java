package com.portfolio.model;

import jakarta.persistence.*;

@Entity
@Table(name = "profile")
public class Profile {
    @Id
    private Long id = 1L;

    @Column(length = 100)
    private String name;

    @Column(length = 200)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(length = 150)
    private String email;

    @Column(length = 300)
    private String github;

    public Profile() {}

    public Profile(Long id, String name, String title, String bio, String email, String github) {
        this.id = id;
        this.name = name;
        this.title = title;
        this.bio = bio;
        this.email = email;
        this.github = github;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getGithub() { return github; }
    public void setGithub(String github) { this.github = github; }
}

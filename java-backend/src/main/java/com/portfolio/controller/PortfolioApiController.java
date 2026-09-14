package com.portfolio.controller;

import com.portfolio.model.Profile;
import com.portfolio.model.Project;
import com.portfolio.model.Skill;
import com.portfolio.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class PortfolioApiController {

    private final PortfolioService portfolioService;

    public PortfolioApiController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping("/portfolio")
    public ResponseEntity<Map<String, Object>> getPortfolio() {
        return ResponseEntity.ok(portfolioService.getFullPortfolioData());
    }

    @GetMapping("/profile")
    public ResponseEntity<Profile> getProfile() {
        return ResponseEntity.ok(portfolioService.getProfile());
    }

    @GetMapping("/skills")
    public ResponseEntity<List<Skill>> getSkills() {
        return ResponseEntity.ok(portfolioService.getAllSkills());
    }

    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getProjects() {
        return ResponseEntity.ok(portfolioService.getAllProjects());
    }
}

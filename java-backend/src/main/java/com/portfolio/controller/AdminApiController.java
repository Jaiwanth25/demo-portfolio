package com.portfolio.controller;

import com.portfolio.model.Profile;
import com.portfolio.model.Project;
import com.portfolio.model.Skill;
import com.portfolio.service.PortfolioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminApiController {

    private final PortfolioService portfolioService;

    public AdminApiController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String username = credentials.get("username");
        String password = credentials.get("password");
        boolean valid = portfolioService.validateAdmin(username, password);

        Map<String, Object> response = new HashMap<>();
        if (valid) {
            response.put("success", true);
            response.put("message", "Authentication successful");
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "Invalid credentials");
            return ResponseEntity.status(401).body(response);
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<Profile> updateProfile(@RequestBody Profile profile) {
        return ResponseEntity.ok(portfolioService.updateProfile(profile));
    }

    @PostMapping("/skills")
    public ResponseEntity<Skill> addSkill(@RequestBody Map<String, String> payload) {
        return ResponseEntity.ok(portfolioService.addSkill(payload.get("name")));
    }

    @DeleteMapping("/skills/{id}")
    public ResponseEntity<Map<String, String>> deleteSkill(@PathVariable Long id) {
        portfolioService.deleteSkill(id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Skill deleted");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/projects")
    public ResponseEntity<Project> addProject(@RequestBody Project project) {
        return ResponseEntity.ok(portfolioService.addProject(project));
    }

    @DeleteMapping("/projects/{id}")
    public ResponseEntity<Map<String, String>> deleteProject(@PathVariable Long id) {
        portfolioService.deleteProject(id);
        Map<String, String> res = new HashMap<>();
        res.put("message", "Project deleted");
        return ResponseEntity.ok(res);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody Map<String, String> payload) {
        String currentPassword = payload.get("current_password");
        String newPassword = payload.get("new_password");
        boolean success = portfolioService.updatePassword("swathi", currentPassword, newPassword);

        Map<String, Object> res = new HashMap<>();
        res.put("success", success);
        res.put("message", success ? "Password updated successfully" : "Current password incorrect");
        return ResponseEntity.ok(res);
    }
}

package com.portfolio.service;

import com.portfolio.model.Admin;
import com.portfolio.model.Profile;
import com.portfolio.model.Project;
import com.portfolio.model.Skill;
import com.portfolio.repository.AdminRepository;
import com.portfolio.repository.ProfileRepository;
import com.portfolio.repository.ProjectRepository;
import com.portfolio.repository.SkillRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class PortfolioService {
    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;
    private final AdminRepository adminRepository;

    public PortfolioService(ProfileRepository profileRepository,
                            SkillRepository skillRepository,
                            ProjectRepository projectRepository,
                            AdminRepository adminRepository) {
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
        this.adminRepository = adminRepository;
    }

    public Map<String, Object> getFullPortfolioData() {
        Map<String, Object> data = new HashMap<>();
        data.put("profile", profileRepository.findById(1L).orElse(null));
        data.put("skills", skillRepository.findAll());
        data.put("projects", projectRepository.findAllByOrderByIdDesc());
        return data;
    }

    public Profile getProfile() {
        return profileRepository.findById(1L).orElse(null);
    }

    public Profile updateProfile(Profile updated) {
        updated.setId(1L);
        return profileRepository.save(updated);
    }

    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    public Skill addSkill(String name) {
        return skillRepository.save(new Skill(name));
    }

    public void deleteSkill(Long id) {
        skillRepository.deleteById(id);
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAllByOrderByIdDesc();
    }

    public Project addProject(Project project) {
        return projectRepository.save(project);
    }

    public void deleteProject(Long id) {
        projectRepository.deleteById(id);
    }

    public boolean validateAdmin(String username, String password) {
        Optional<Admin> admin = adminRepository.findByUsername(username);
        return admin.isPresent() && admin.get().getPassword().equals(password);
    }

    public boolean updatePassword(String username, String currentPassword, String newPassword) {
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (admin.getPassword().equals(currentPassword)) {
                admin.setPassword(newPassword);
                adminRepository.save(admin);
                return true;
            }
        }
        return false;
    }
}

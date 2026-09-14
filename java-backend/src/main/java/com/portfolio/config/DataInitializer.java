package com.portfolio.config;

import com.portfolio.model.Admin;
import com.portfolio.model.Profile;
import com.portfolio.model.Project;
import com.portfolio.model.Skill;
import com.portfolio.repository.AdminRepository;
import com.portfolio.repository.ProfileRepository;
import com.portfolio.repository.ProjectRepository;
import com.portfolio.repository.SkillRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final ProfileRepository profileRepository;
    private final SkillRepository skillRepository;
    private final ProjectRepository projectRepository;

    public DataInitializer(AdminRepository adminRepository,
                           ProfileRepository profileRepository,
                           SkillRepository skillRepository,
                           ProjectRepository projectRepository) {
        this.adminRepository = adminRepository;
        this.profileRepository = profileRepository;
        this.skillRepository = skillRepository;
        this.projectRepository = projectRepository;
    }

    @Override
    public void run(String... args) {
        if (adminRepository.count() == 0) {
            adminRepository.save(new Admin("swathi", "1234"));
            System.out.println("Java Backend: Default admin initialized (swathi / 1234)");
        }

        if (profileRepository.count() == 0) {
            profileRepository.save(new Profile(
                    1L,
                    "Swathi",
                    "CS Student | Full-Stack Developer",
                    "I am a first-year Computer Science Engineering student interested in programming, web development and building useful digital projects.",
                    "pswathi232022@gmail.com",
                    "https://github.com/ihtaws-08/project"
            ));
            System.out.println("Java Backend: Default profile initialized.");
        }

        if (skillRepository.count() == 0) {
            List<String> defaultSkills = Arrays.asList("Python", "SQL", "HTML/CSS", "MySQL", "Git/GitHub", "Node.js", "Java", "Spring Boot");
            for (String s : defaultSkills) {
                skillRepository.save(new Skill(s));
            }
            System.out.println("Java Backend: Default skills initialized.");
        }

        if (projectRepository.count() == 0) {
            projectRepository.save(new Project(
                    "Personal Portfolio CMS",
                    "A full-stack portfolio management platform with live admin controls, responsive UI, and secure database persistence.",
                    "Node.js, Express, Java Spring Boot, MySQL/H2",
                    "https://github.com/ihtaws-08/project"
            ));
            projectRepository.save(new Project(
                    "Student Management System",
                    "A console and web-based database application for managing student academic records and course enrollment.",
                    "Java, Spring Data JPA, SQL",
                    "https://github.com/ihtaws-08/project"
            ));
            System.out.println("Java Backend: Default projects initialized.");
        }
    }
}

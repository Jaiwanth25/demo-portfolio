window.addEventListener("load", function() {
    document.body.classList.add("loaded");
});

// Navbar background transition on scroll
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", function() {
    if (window.scrollY > 30) {
        navbar.classList.add("scrolled");
    } else {
        navbar.classList.remove("scrolled");
    }
});

// Mobile Drawer Menu
const menuButton = document.getElementById("menuButton");
const navLinks = document.getElementById("navLinks");

if (menuButton && navLinks) {
    menuButton.addEventListener("click", function() {
        navLinks.classList.toggle("open");
    });

    document.querySelectorAll(".nav-links a").forEach(function(link) {
        link.addEventListener("click", function() {
            navLinks.classList.remove("open");
        });
    });
}

// Scroll Intersection Observer for Reveal Animations
const revealElements = document.querySelectorAll(".reveal");

const revealObserver = new IntersectionObserver(
    function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    {
        threshold: 0.12
    }
);

revealElements.forEach(function(element) {
    revealObserver.observe(element);
});

// Active Link Highlighting based on scroll position
const sections = document.querySelectorAll("section[id]");
const navigationLinks = document.querySelectorAll(".nav-links a[href^='#']");

window.addEventListener("scroll", function() {
    let current = "";
    sections.forEach(function(section) {
        const sectionTop = section.offsetTop - 180;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }
    });

    navigationLinks.forEach(function(link) {
        link.classList.remove("active");
        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }
    });
});

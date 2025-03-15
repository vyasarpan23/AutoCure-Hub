document.addEventListener("DOMContentLoaded", function () {
    // Mobile Menu Toggle
    const menuToggle = document.getElementById("menuToggle");
    const sidebar = document.querySelector("aside");

    if (menuToggle) {
        menuToggle.addEventListener("click", function () {
            sidebar.classList.toggle("hidden");
        });
    }

    // Dark Mode Toggle
    const darkModeToggle = document.getElementById("darkModeToggle");
    if (darkModeToggle) {
        darkModeToggle.addEventListener("click", function () {
            document.body.classList.toggle("dark-mode");
        });
    }

    // Logout button functionality
    const logoutBtn = document.getElementById("logoutBtn");
    const sidebarLogoutBtn = document.getElementById("sidebarLogoutBtn");
    if (logoutBtn) {
        const logoutFunction = function () {
            if (confirm("Are you sure you want to logout?")) {
                window.location.href = "../index.html";
            }
        };
        logoutBtn.addEventListener("click", logoutFunction);
        sidebarLogoutBtn.addEventListener("click", logoutFunction);
    }

    // Profile Sidebar Toggle
    const profileImage = document.getElementById("clientImage");
    const profileSidebar = document.getElementById("profileSidebar");
    const sidebarProfileImage = document.getElementById("sidebarProfileImage");
    const sidebarProfileName = document.getElementById("sidebarProfileName");
    const sidebarProfilePost = document.getElementById("sidebarProfilePost");

    profileImage.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents the event from bubbling up
        profileSidebar.classList.toggle("hidden"); // Toggle visibility
        profileImage.classList.toggle("hidden"); // Hide profile image
        logoutBtn.classList.toggle("hidden"); // Hide logout button
        sidebarProfileImage.src = profileImage.src; // Set sidebar profile image
        sidebarProfileName.textContent = "Nattu Kaka"; // Set sidebar profile name
        sidebarProfilePost.textContent = "Manager"; // Set sidebar profile post
    });

    document.addEventListener("click", function (event) {
        if (!profileSidebar.contains(event.target) && event.target !== profileImage) {
            profileSidebar.classList.add("hidden");
            profileImage.classList.remove("hidden"); // Show profile image
            logoutBtn.classList.remove("hidden"); // Show logout button
        }
    });
});


document.getElementById("clientImage").addEventListener("click", function () {
    document.getElementById("profileSidebar").classList.toggle("active");
});


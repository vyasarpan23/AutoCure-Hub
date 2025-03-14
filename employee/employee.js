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
    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            if (confirm("Are you sure you want to logout?")) {
                window.location.href = "../index.html";
            }
        });
    }
});

document.addEventListener("DOMContentLoaded", function () {
    const profileImage = document.getElementById("clientImage");
    const profilePopup = document.getElementById("profilePopup");

    profileImage.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevents the event from bubbling up
        profilePopup.classList.toggle("hidden"); // Toggle visibility
    });

    document.addEventListener("click", function (event) {
        if (!profilePopup.contains(event.target) && event.target !== profileImage) {
            profilePopup.classList.add("hidden");
        }
    });
});

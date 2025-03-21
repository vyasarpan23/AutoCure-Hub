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

document.getElementById('addManagerBtn').addEventListener('click', function () {
    document.getElementById('managerSignupModal').classList.remove('hidden');
});

document.getElementById('closeModal').addEventListener('click', function () {
    document.getElementById('managerSignupModal').classList.add('hidden');
});
document.querySelectorAll('.toggle-password').forEach(item => {
item.addEventListener('click', function () {
    let passwordInput = this.previousElementSibling;
    if (passwordInput.type === "password") {
        passwordInput.type = "text";
        this.innerHTML = "👁️‍🗨️"; // Change icon when visible
    } else {
        passwordInput.type = "password";
        this.innerHTML = "👁️"; // Change icon when hidden
    }
});
});
document.getElementById('managerSignupBtn').addEventListener('click', function (event) {
event.preventDefault(); // Prevent form submission

let password = document.querySelector('input[name="password"]').value;
let confirmPassword = document.querySelector('input[name="confirmPassword"]').value;
let mobile = document.querySelector('input[name="mobile"]').value;
let email = document.querySelector('input[name="email"]').value;

// Password Match Validation
if (password !== confirmPassword) {
    alert("Passwords do not match!");
    return;
}

// Mobile Number Validation (Only 10 digits)
if (!/^\d{10}$/.test(mobile)) {
    alert("Mobile number must be exactly 10 digits!");
    return;
}

// Email Validation (@gmail.com only)
if (!email.endsWith("@gmail.com")) {
    alert("Email must be a Gmail address (@gmail.com)!");
    return;
}

alert("Signup successful!"); // Replace this with form submission logic
});

    // Open modal when clicking "Add Employee" button
    document.getElementById('addEmployeeBtn').addEventListener('click', function (event) {
        event.preventDefault();
        document.getElementById('employeeSignupModal').classList.remove('hidden');
    });

    // Close modal when clicking the close button
    document.getElementById('closeEmployeeModal').addEventListener('click', function () {
        document.getElementById('employeeSignupModal').classList.add('hidden');
    });

    // Toggle password visibility
    document.querySelectorAll('.toggle-password').forEach(item => {
        item.addEventListener('click', function () {
            let passwordInput = this.previousElementSibling;
            passwordInput.type = passwordInput.type === "password" ? "text" : "password";
            this.innerHTML = passwordInput.type === "password" ? "👁️" : "👁️‍🗨️";
        });
    });

    // Form validation
    document.getElementById('employeeSignupBtn').addEventListener('click', function (event) {
        event.preventDefault();

        let password = document.querySelector('input[name="password"]').value;
        let confirmPassword = document.querySelector('input[name="confirmPassword"]').value;
        let mobile = document.querySelector('input[name="mobile"]').value;
        let email = document.querySelector('input[name="email"]').value;

        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }

        if (!/^\d{10}$/.test(mobile)) {
            alert("Mobile number must be exactly 10 digits!");
            return;
        }

        if (!email.endsWith("@gmail.com")) {
            alert("Email must be a Gmail address (@gmail.com)!");
            return;
        }

        alert("Employee signup successful!");
    });

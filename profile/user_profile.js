window.addEventListener("load", () => {

    const horn = new Audio("../assets/sounds/horn.mp3");
    horn.play();
 // Ensures it plays only once per page load
});

document.addEventListener("DOMContentLoaded", () => {
    // Elements
    const profileImage = document.getElementById("profile-image");
    const editIcon = document.querySelector(".edit");
    const nameElement = document.querySelector("h2");
    const emailElement = document.querySelector("p:nth-of-type(1)");
    const phoneElement = document.querySelector("p:nth-of-type(2)");
    const darkModeToggle = document.getElementById("darkModeToggle");
    const logoutBtn = document.getElementById("logoutBtn");

    // Fetch user data (simulating backend or localStorage)
    let userData = JSON.parse(localStorage.getItem("userProfile")) || {
        name: "John Doe",
        email: "johndoe@example.com",
        phone: "+1234567890",
        image: "../assets/image-person.png"
    };

    // Apply stored user data
    nameElement.textContent = userData.name;
    emailElement.textContent = `Email: ${userData.email}`;
    phoneElement.textContent = `Phone: ${userData.phone}`;
    profileImage.src = userData.image;

    // Edit Profile Info
    editIcon.addEventListener("click", () => {
        let newName = prompt("Enter new name:", userData.name);
        let newEmail = prompt("Enter new email:", userData.email);
        let newPhone = prompt("Enter new phone:", userData.phone);

        if (newName) userData.name = newName;
        if (newEmail) userData.email = newEmail;
        if (newPhone) userData.phone = newPhone;

        // Update UI
        nameElement.textContent = userData.name;
        emailElement.textContent = `Email: ${userData.email}`;
        phoneElement.textContent = `Phone: ${userData.phone}`;

        // Save to localStorage
        localStorage.setItem("userProfile", JSON.stringify(userData));
    });

    // Change Profile Picture
    profileImage.addEventListener("click", () => {
        let newImageUrl = prompt("Enter new profile image URL:");
        if (newImageUrl) {
            profileImage.src = newImageUrl;
            userData.image = newImageUrl;
            localStorage.setItem("userProfile", JSON.stringify(userData));
        }
    });

    // Dark Mode Toggle
    darkModeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark");
        let isDark = document.body.classList.contains("dark");
        localStorage.setItem("darkMode", isDark);
    });

    // Apply Dark Mode if Enabled
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
    }

    // Logout
    logoutBtn.addEventListener("click", () => {
        if(confirm("Are you sure you want to logout?")){
            localStorage.removeItem("userProfile");
            window.location.href = "../index.html"; // Redirect to homepage
        }
       
    });
});

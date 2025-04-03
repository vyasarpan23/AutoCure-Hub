window.addEventListener("load", async () => {
    const horn = new Audio("../assets/sounds/horn.mp3");
    horn.play();
    await fetchUserProfile(); // Fetch user data on page load
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
    const imageInput = document.createElement("input");
    imageInput.type = "file";
    imageInput.accept = "image/*";

    // Fetch user data from the backend
    async function fetchUserProfile() {
        try {
            const response = await fetch("http://localhost:8080/api/profile", {
                method: "GET",
                credentials: "include"
            });
            if (!response.ok) throw new Error("Failed to fetch profile data");

            const userData = await response.json();

            // Update UI with fetched data
            nameElement.textContent = userData.name;
            emailElement.textContent = `Email: ${userData.email}`;
            phoneElement.textContent = `Phone: ${userData.phone}`;

            // Convert Base64 image to display format
            if (userData.image) {
                profileImage.src = `data:image/jpeg;base64,${userData.image}`;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    }

    // Edit Profile Info
    editIcon.addEventListener("click", async () => {
        let newName = prompt("Enter new name:", nameElement.textContent);
        let newEmail = prompt("Enter new email:", emailElement.textContent.replace("Email: ", ""));
        let newPhone = prompt("Enter new phone:", phoneElement.textContent.replace("Phone: ", ""));

        if (!newName || !newEmail || !newPhone) return;

        try {
            const response = await fetch("http://localhost:8080/api/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name: newName, email: newEmail, phone: newPhone })
            });

            if (!response.ok) throw new Error("Failed to update profile");

            // Update UI
            nameElement.textContent = newName;
            emailElement.textContent = `Email: ${newEmail}`;
            phoneElement.textContent = `Phone: ${newPhone}`;
        } catch (error) {
            console.error("Error updating profile:", error);
        }
    });

    // Change Profile Picture
    profileImage.addEventListener("click", () => {
        imageInput.click();
    });

    imageInput.addEventListener("change", async () => {
        const file = imageInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
            const response = await fetch("http://localhost:8080/api/profile/image", {
                method: "POST",
                body: formData,
                credentials: "include"
            });

            if (!response.ok) throw new Error("Failed to upload image");

            const data = await response.json();
            profileImage.src = `data:image/jpeg;base64,${data.image}`; // Update UI with new image
        } catch (error) {
            console.error("Error uploading image:", error);
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
        if (confirm("Are you sure you want to logout?")) {
            fetch("http://localhost:8080/api/logout", { method: "POST", credentials: "include" })
                .then(() => (window.location.href = "../index.html"))
                .catch((error) => console.error("Logout failed:", error));
        }
    });
});

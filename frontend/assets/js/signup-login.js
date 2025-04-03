let isLoggedIn = false;
let user = {};


const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");


loginBtn?.addEventListener("click", () => openModal("authModal"));
signupBtn?.addEventListener("click", () => openModal("signupModal"));

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("userLoginForm");
    const signupForm = document.getElementById("userSignup");
    const managerSignupForm = document.getElementById("managerSignupForm");
    const managerLoginForm = document.getElementById("managerLoginForm");
    const employeeSignupForm = document.getElementById("employeeSignupForm");
    const employeeLoginForm = document.getElementById("employeeLoginForm");

    const loginModal = document.getElementById("authModal");
    const signupModal = document.getElementById("signupModal");
  
    const openSignupModalLink = document.getElementById("openSignupModal");
    const openLoginModalLink = document.getElementById("openLoginModal");
  
    async function handleLogin(event, endpoint, redirect = null) {
      event.preventDefault();
  
      const form = event.target;
      const formData = new FormData(form);
      const requestBody = {};
  
      formData.forEach((value, key) => {
        requestBody[key] = value;
      });
  
      try {
        const response = await fetch(`http://localhost:8080/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Login successful!");
          form.reset();
          loginModal.style.display = "none";
  
          if (redirect) {
            window.location.href = redirect;
          }
        } else {
          alert(data.message || "Invalid credentials. Try again.");
        }
      } catch (error) {
        console.error("Login Error:", error);
        alert("An error occurred. Please try again.");
      }
    }
  
    async function handleSignup(event, endpoint) {
      event.preventDefault();
  
      const form = event.target;
      const formData = new FormData(form);
      const requestBody = {};
  
      formData.forEach((value, key) => {
        requestBody[key] = value;
      });
  
      if (requestBody.password !== requestBody.confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
  
      try {
        const response = await fetch(`http://localhost:8080/${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestBody),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          alert("Signup successful! Redirecting to login...");
          form.reset();
          signupModal.style.display = "none";
          loginModal.style.display = "block";
        } else {
          alert(data.message || "Signup failed. Try again.");
        }
      } catch (error) {
        console.error("Signup Error:", error);
        alert("An error occurred. Please try again.");
      }
    }
  
    // Event Listeners
    if (loginForm) {
      loginForm.addEventListener("submit", (event) => handleLogin(event, "login"));
    }
  
    if (managerLoginForm) {
      managerLoginForm.addEventListener("submit", (event) =>
        handleLogin(event, "manager-login", "./manager/manager.html")
      );
    }
  
    if (signupForm) {
      signupForm.addEventListener("submit", (event) => handleSignup(event, "user-signup"));
    }
  
    if (managerSignupForm) {
      managerSignupForm.addEventListener("submit", (event) => handleSignup(event, "manager-signup"));
    }
  
    if (employeeSignupForm) {
      employeeSignupForm.addEventListener("submit", (event) => handleSignup(event, "employee-signup"));
    }
  
    if (openSignupModalLink) {
      openSignupModalLink.addEventListener("click", function (event) {
        event.preventDefault();
        loginModal.style.display = "none";
        signupModal.style.display = "block";
      });
    }
  
    if (openLoginModalLink) {
      openLoginModalLink.addEventListener("click", function (event) {
        event.preventDefault();
        signupModal.style.display = "none";
        loginModal.style.display = "block";
      });
    }
  });

  //password eye button
document.addEventListener("DOMContentLoaded", function () {
    function togglePasswordVisibility(inputClass, toggleClass) {
      const inputFields = document.querySelectorAll(`.${inputClass}`);
      const toggleButtons = document.querySelectorAll(`.${toggleClass}`);
  
      if (inputFields.length > 0 && toggleButtons.length > 0) {
        toggleButtons.forEach((toggleButton, index) => {
          toggleButton.addEventListener("click", function () {
            const inputField = inputFields[index]; // Match the input field with the toggle button
            if (inputField.type === "password") {
              inputField.type = "text"; // Show password
              toggleButton.textContent = "🔒"; // Change icon
            } else {
              inputField.type = "password"; // Hide password
              toggleButton.textContent = "👁️"; // Change back to eye icon
            }
          });
        });
      }
    }
  
    // Apply to all Password and Confirm Password fields
    togglePasswordVisibility("password-input", "toggle-password");
  });
  
  //logout button
  document.addEventListener("DOMContentLoaded", function () {
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");
    const clientImage = document.getElementById("clientImage");
    const profileBtn = document.getElementById("profileBtn");
  
    // Change this to true to simulate a logged-in user
  
    if (isLoggedIn) {
      loginBtn.classList.add("hidden");
      signupBtn.classList.add("hidden");
      logoutBtn.classList.remove("hidden");
      clientImage.classList.remove("hidden");
    } else {
      loginBtn.classList.remove("hidden");
      signupBtn.classList.remove("hidden");
      logoutBtn.classList.add("hidden");
      clientImage.classList.add("hidden");
    }
  
    // Add event listener for logout button
    logoutBtn.addEventListener("click", function () {
      // Perform logout actions here
     if(confirm("Are you sure you want to logout!")){
        isLoggedIn = false;
        alert("Logged out successfully!");
        loginBtn.classList.remove("hidden");
        signupBtn.classList.remove("hidden");
        logoutBtn.classList.add("hidden");
        clientImage.classList.add("hidden");
     }
    });
  });
  
  //porfile page
  document.addEventListener("DOMContentLoaded", function () {
    const profile = document.querySelector("#clientImage");
    const profilePage = document.querySelector("#profileModal");
    const profileName = document.querySelector("#editName");
  
    profile.addEventListener("click", function () {
      profilePage.classList.remove = "hidden";
    });
  
    if (profilePage) {
      profileName.textContent = user.name;
      profileEmail.textContent = user.email;
      profileId.textContent = user.id;
    }
  });
  
  
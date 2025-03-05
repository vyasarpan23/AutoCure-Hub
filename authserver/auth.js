document.addEventListener("DOMContentLoaded", function () {
    const authModal = document.getElementById("authModal");
    const signupModal = document.getElementById("signupModal");
  
    // Function to handle authentication requests
    async function handleAuth(event, formType) {
      event.preventDefault();
  
      const form = event.target;
      const role = form.dataset.role; // 'user', 'employee', or 'manager'
      const isSignup = formType === "signup";
  
      const name = form.querySelector('input[name="name"]')?.value.trim();
      const email = form.querySelector('input[name="email"]').value.trim();
      const mobile = form.querySelector('input[name="mobile"]')?.value.trim();
      const password = form.querySelector('input[name="password"]').value.trim();
      const confirmPassword = form.querySelector('input[name="confirmPassword"]')?.value.trim();
      const securityKey = form.querySelector('input[name="securityKey"]')?.value.trim();
  
      // Validation
      if (isSignup) {
        if (!name || !email || !mobile || !password || (confirmPassword && password !== confirmPassword)) {
          alert("Please fill in all fields correctly.");
          return;
        }
        if (mobile && !/^\d{10}$/.test(mobile)) {
          alert("Invalid mobile number.");
          return;
        }
      }
  
      const endpoint = isSignup ? `/${role}-signup` : `/${role}-login`;
      const payload = isSignup
        ? { name, email, mobile, password, security_key: securityKey }
        : { email, password };
  
      try {
        const response = await fetch(`http://localhost:8080/auth${endpoint}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
        if (response.ok) {
          alert(`${isSignup ? "Signup" : "Login"} successful! Welcome`);
  
          if (isSignup) {
            // Close signup modal and open login modal
            signupModal.style.display = "none";
            authModal.style.display = "block";
          } else {
            // Store token for authentication
            localStorage.setItem("authToken", data.token);
            localStorage.setItem("userRole", role); // Store user role
  
            // Redirect based on role
            if (role === "manager") {
              window.location.href = "./manager/manager.html";
            } else if (role === "employee") {
              window.location.href = "./employee/employee.html";
            } else {
              authModal.style.display = "none"; // Close modal for users
            }
          }
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    }
  
    // Attach event listeners to all signup and login forms
    document.querySelectorAll("form[data-role]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        const formType = form.id.includes("Signup") ? "signup" : "login";
        handleAuth(event, formType);
      });
    });
  
  });
  
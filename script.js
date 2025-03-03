// Simulate login status
let isLoggedIn = false;
let user = {};

// Modal Handling
const modals = document.querySelectorAll(".modal");
const closeBtns = document.querySelectorAll(".close");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const contactBtn = document.getElementById("contactBtn");
const contactBtn2 = document.getElementById("contactBtn2");
const serviceBtn = document.getElementById("services-button");
const reviewBtn = document.getElementById("reviewBtn");
const bookServiceBtn = document.getElementById("bookServiceBtn");

function openModal(modalId) {
  document.getElementById(modalId).style.display = "block";
}

function closeModal(modalId) {
  document.getElementById(modalId).style.display = "none";
}

// Modal button event listeners
loginBtn?.addEventListener("click", () => openModal("authModal"));
signupBtn?.addEventListener("click", () => openModal("signupModal"));
contactBtn?.addEventListener("click", () => openModal("contactModal"));
contactBtn2?.addEventListener("click", () => openModal("contactModal"));
serviceBtn?.addEventListener("click", () => openModal("servicesModal"));
bookServiceBtn?.addEventListener("click", () => openModal("servicesModal"));
reviewBtn?.addEventListener("click", () => openModal("ratingModal"));

closeBtns.forEach((btn) => {
  btn.onclick = function () {
    modals.forEach((modal) => {
      modal.style.display = "none";
    });
  };
});

// Tab System
const tabButtons = document.querySelectorAll(".tab-button");
const tabContents = document.querySelectorAll(".tab-content");

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((btn) => btn.classList.remove("active"));
    tabContents.forEach((content) => content.classList.remove("active"));

    button.classList.add("active");
    const tabId = button.getAttribute("data-tab") + "Form";
    document.getElementById(tabId)?.classList.add("active");
  });
});

// Close modal when clicking outside
window.onclick = function (event) {
  modals.forEach((modal) => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
};

// Function to add new reviews dynamically
// function addNewReview(name, rating, comment) {
//   if (slider) {
//     const newReview = createReviewCard(name, rating, comment);
//     slider.appendChild(newReview);
//     slider.appendChild(newReview.cloneNode(true));

//     // Reset animation
//     slider.style.animation = "none";
//     slider.offsetHeight; // Trigger reflow
//     slider.style.animation = null;
//   }
// }

// Ensure the code runs only in a browser environment
if (typeof window !== "undefined" && typeof document !== "undefined") {
  // Customer Reviews Slider
  function createReviewCard(name, rating, comment) {
    const card = document.createElement("div");
    card.className = "review-card";
    card.innerHTML = `
      <img src="./assets/image-person.png" alt="${name}" class="customer-img">
      <h4 class="font-bold">${name}</h4>
      <div class="star-rating">
        ${Array(rating).fill('<i class="fas fa-star"></i>').join("")}
      </div>
      <p class="mt-2">"${comment}"</p>
    `;
    return card;
  }
}
// Initialize Swiper
// Initialize Swiper with loop and continuous autoplay
const swiper = new Swiper(".swiper-container", {
  loop: true, // Enables infinite loop
  autoplay: {
    delay: 5000, // Adjust speed as needed
    disableOnInteraction: false, // Keeps autoplay even after interaction
  },
  speed: 600, // Transition speed
  slidesPerView: "auto", // Ensures smooth continuous scrolling
  centeredSlides: true, // Keeps the active slide in center
  spaceBetween: 20, // Spacing between slides
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  effect: "slide", // Keeps smooth sliding effect
});


// Smooth scroll for navigation links
const navLinks = document.querySelectorAll(".nav-link");
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href").slice(1);
    const targetElement = document.getElementById(targetId);
    targetElement.scrollIntoView({ behavior: "smooth" });
  });
});

// Initialize star rating
function initializeStarRating() {
  const starContainer = document.querySelector("#starRating");
  if (!starContainer) return;

  let currentRating = 0;
  const stars = starContainer.querySelectorAll("i");

  stars.forEach((star, index) => {
    star.addEventListener("mouseover", () => {
      for (let i = 0; i <= index; i++) {
        stars[i].classList.add("fas");
        stars[i].classList.remove("far");
      }
    });

    star.addEventListener("mouseout", () => {
      stars.forEach((s, i) => {
        if (i >= currentRating) {
          s.classList.remove("fas");
          s.classList.add("far");
        }
      });
    });

    star.addEventListener("click", () => {
      currentRating = index + 1;
      stars.forEach((s, i) => {
        if (i < currentRating) {
          s.classList.add("fas");
          s.classList.remove("far");
        } else {
          s.classList.remove("fas");
          s.classList.add("far");
        }
      });
    });
  });

  async function fetchReviews() {
    const slider = document.querySelector(".reviews-slider");
    try {
      const response = await fetch("http://localhost:8080/reviews");
      const reviews2 = await response.json();

      slider.innerHTML = ""; // Clear existing reviews


      reviews2.map((review) => {
        const card = createReviewCard(
          review.user_name,
          review.rating,
          review.comment
        );
        slider.appendChild(card);
      });
    } catch (error) {
      console.error("Error fetching reviews:", error);
    }
  }

  // Call fetchReviews when page loads
  document.addEventListener("DOMContentLoaded", fetchReviews);

  document
    .getElementById("submitRating")
    .addEventListener("click", async (e) => {
      e.preventDefault();

      if (!isLoggedIn) {
        alert("Please login to submit a review.");
        loginModal.style.display = "block";
        return;
      }

      const rating = currentRating;
      const comment = document.getElementById("ratingMessage").value;
      const userId = user.id;

      if (!rating || !comment.trim()) {
        alert("Please provide a rating and a comment.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/submit-review", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            //Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, rating, comment }),
        });

        if (response.ok) {
          alert("Review submitted successfully!");
          document.getElementById("ratingMessage").value = "";
          fetchReviews(); // Refresh reviews after submitting
        } else {
          const data = await response.json();
          alert(data.message);
        }
      } catch (error) {
        console.error("Error submitting review:", error);
        alert("Error submitting review. Please try again.");
      }
    });
    
  const reviewForm = document.getElementById("ratingModal");
  reviewForm.addEventListener("keydown", function (event) {
    const submitReview = document.getElementById("submitRating");
    if (event.key === "Enter") {
      event.preventDefault(); // Prevent the default form submission on Enter

      if (submitReview) {
        submitReview.click(); // Simulate the click on the submit button
      }
    }
  });
}

// Call initialization functions
initializeStarRating();

// Form validation
function validateForm(form) {
  const inputs = form.querySelectorAll("input[required], textarea[required]");
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      isValid = false;
      input.classList.add("border-red-500");
    } else {
      input.classList.remove("border-red-500");
    }
  });

  return isValid;
}

// WhatsApp integration
document.querySelector(".whatsapp-btn")?.addEventListener("click", (e) => {
  e.preventDefault();
  const phoneNumber = "1234567890";
  const message = encodeURIComponent(
    "Hi, I would like to know more about your services."
  );
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
});

// Loading state for buttons
document.querySelectorAll('button[type="submit"]').forEach((button) => {
  button.addEventListener("click", function () {
    if (validateForm(this.closest("form"))) {
      this.innerHTML =
        '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
      this.disabled = true;
      setTimeout(() => {
        this.innerHTML = "Submitted";
        this.disabled = false;
      }, 1000);
    }
  });
});

// Initialize tooltips
const tooltips = document.querySelectorAll("[data-tooltip]");
tooltips.forEach((tooltip) => {
  tooltip.addEventListener("mouseover", (e) => {
    const tip = document.createElement("div");
    tip.className = "tooltip absolute bg-black text-white p-2 rounded text-sm";
    tip.textContent = e.target.dataset.tooltip;
    document.body.appendChild(tip);

    const rect = e.target.getBoundingClientRect();
    tip.style.top = `${rect.bottom + 5}px`;
    tip.style.left = `${rect.left}px`;

    tooltip.addEventListener("mouseout", () => {
      document.querySelector(".tooltip")?.remove();
    });
  });
});

// Initialize mobile menu
const mobileMenuBtn = document.querySelector(".mobile-menu-button");
const mobileMenu = document.querySelector(".mobile-menu");

if (mobileMenuBtn && mobileMenu) {
  mobileMenuBtn.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
  });
}

//login form Handler
document.addEventListener("DOMContentLoaded", function () {
  const loginForm = document.querySelector("#userLoginForm");
  const signupModal = document.getElementById("signupModal");
  const loginModal = document.getElementById("authModal");
  const openSignupModalLink = document.getElementById("openSignupModal");
  const loginSubmitBtn = document.querySelector("#loginSubmitBtn");

  if (loginForm) {
    loginSubmitBtn.addEventListener("click", async function (e) {
      e.preventDefault();

      const email = loginForm.querySelector('input[type="email"]').value;
      const password = loginForm.querySelector('input[type="password"]').value;

      if (!email || !password) {
        alert("Please enter email and password.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        user = data.user;

        if (response.ok) {
          alert("Login successful!");
          loginForm.reset();
          isLoggedIn = true;
          loginBtn.classList.add("hidden");
          signupBtn.classList.add("hidden");
          logoutBtn.classList.remove("hidden");
          clientImage.classList.remove("hidden");
          loginModal.style.display = "none";
        } else {
          if (data.message === "User not found") {
            alert("Email not found. Redirecting to signup...");
            loginModal.style.display = "none"; // Close login modal
            signupModal.style.display = "block"; // Open signup modal
          } else {
            alert(data.message);
          }
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }
    });

    loginForm.addEventListener("keydown", function (event) {
      if (event.key === "Enter") {
        event.preventDefault(); // Prevent the default form submission on Enter

        if (loginSubmitBtn) {
          loginSubmitBtn.click(); // Simulate the click on the submit button
        }
      }
    });
  }

  // Open Signup Modal when "Sign up" link is clicked
  if (openSignupModalLink) {
    openSignupModalLink.addEventListener("click", function (event) {
      event.preventDefault();
      loginModal.style.display = "none";
      signupModal.style.display = "block";
    });
  }
});

// Handle Signup form submission
document.addEventListener("DOMContentLoaded", function () {
  const signupForm = document.querySelector("#userSignup");
  const loginModal = document.getElementById("authModal");
  const signupModal = document.getElementById("signupModal");
  const openLoginModalLink = document.getElementById("openLoginModal");
  const signupSubmitBtn = document.querySelector("#signupSubmitBtn");

  if (signupForm) {
    signupSubmitBtn.addEventListener("click", async function (event) {
      event.preventDefault();

      const name = signupForm.querySelector('input[name="name"]').value.trim();
      const email = signupForm.querySelector('input[name="email"]').value;
      const mobile = signupForm
        .querySelector('input[name="mobile"]')
        .value.trim();
      const password = signupForm.querySelector('input[name="password"]').value;
      const confirmPassword = signupForm.querySelector(
        'input[name="confirmPassword"]'
      ).value;

      // Name validation: must start with a letter (no spaces or numbers at first position)
      const nameRegex = /^[A-Za-z][A-Za-z\s]*$/;
      if (!nameRegex.test(name)) {
        alert("Invalid name. The first character must be a letter.");
        return;
      }

      if (!name || !email || !mobile || !password || !confirmPassword) {
        alert("Please fill in all fields.");
        return;
      }

      if (!/^\d{10}$/.test(mobile)) {
        alert("Please enter a valid 10-digit mobile number");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords do not match. Please try again.");
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name, email, mobile, password }),
        });

        const data = await response.json();

        if (response.ok) {
          alert("Signup successful!\nRedirecting to login...");
          signupForm.reset();
          loginModal.style.display = "block"; // Open login modal
          signupModal.style.display = "none"; // Close signup modal
        } else {
          alert(data.message);
        }
      } catch (error) {
        console.error("Error:", error);
        alert("An error occurred. Please try again.");
      }

      signupForm.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {
          event.preventDefault(); // Prevent default form submission on Enter
  
          if (signupSubmitBtn) {
            signupSubmitBtn.click(); // Simulate click on submit button
          }
        }
      });
    });
  }

  // Open Login Modal when "Login" link is clicked
  if (openLoginModalLink) {
    openLoginModalLink.addEventListener("click", function (event) {
      event.preventDefault();
      signupModal.style.display = "none"; // Close signup modal
      loginModal.style.display = "block"; // Open login modal
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
    isLoggedIn = false;
    alert("Logged out successfully!");
    loginBtn.classList.remove("hidden");
    signupBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
    clientImage.classList.add("hidden");
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

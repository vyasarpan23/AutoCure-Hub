
const params = new URLSearchParams(window.location.search);
const managerId = params.get("userId");
  

window.addEventListener("load", () => {

      const horn = new Audio("../assets/sounds/horn.mp3");
      horn.play();
  
});

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

  function logoutFunction() {
    if (confirm("Are you sure you want to logout?")) {
      window.location.href = "../index.html";
    }
  }

  if (logoutBtn) logoutBtn.addEventListener("click", logoutFunction);
  if (sidebarLogoutBtn)
    sidebarLogoutBtn.addEventListener("click", logoutFunction);

  // Profile Sidebar Toggle
  const profileImage = document.getElementById("clientImage");
  const profileSidebar = document.getElementById("profileSidebar");
  const sidebarProfileImage = document.getElementById("sidebarProfileImage");
  const sidebarProfileName = document.getElementById("sidebarProfileName");
  const sidebarProfilePost = document.getElementById("sidebarProfilePost");

  if (profileImage && profileSidebar) {
    profileImage.addEventListener("click", function (event) {
      event.stopPropagation();
      profileSidebar.classList.toggle("hidden");

      // Set profile details in sidebar
      sidebarProfileImage.src = profileImage.src;
      sidebarProfileName.textContent = "Nattu Kaka";
      sidebarProfilePost.textContent = "Manager";
    });

    document.addEventListener("click", function (event) {
      if (
        !profileSidebar.contains(event.target) &&
        event.target !== profileImage
      ) {
        profileSidebar.classList.add("hidden");
      }
    });
  }

  // Add Manager Modal Toggle
  const addManagerBtn = document.getElementById("addManagerBtn");
  const managerSignupModal = document.getElementById("managerSignupModal");
  const closeManagerModal = document.getElementById("closeModal");

  if (addManagerBtn && managerSignupModal && closeManagerModal) {
    addManagerBtn.addEventListener("click", function () {
      managerSignupModal.classList.remove("hidden");
    });

    closeManagerModal.addEventListener("click", function () {
      managerSignupModal.classList.add("hidden");
    });
  }

  // Toggle Password Visibility
  document.querySelectorAll(".toggle-password").forEach((item) => {
    item.addEventListener("click", function () {
      let passwordInput = this.previousElementSibling;
      passwordInput.type =
        passwordInput.type === "password" ? "text" : "password";
      this.innerHTML = passwordInput.type === "password" ? "👁️" : "🔒";
    });
  });

  // Employee Signup Modal
  const addEmployeeBtn = document.getElementById("addEmployeeBtn");
  const employeeSignupModal = document.getElementById("employeeSignupModal");
  const closeEmployeeModal = document.getElementById("closeEmployeeModal");

  if (addEmployeeBtn && employeeSignupModal && closeEmployeeModal) {
    addEmployeeBtn.addEventListener("click", function (event) {
      event.preventDefault();
      employeeSignupModal.classList.remove("hidden");
    });

    closeEmployeeModal.addEventListener("click", function () {
      employeeSignupModal.classList.add("hidden");
    });
  }

  // Signup Form Submission
  async function handleSignup(event, endpoint, role) {
    event.preventDefault();

    const form = event.target;
    const formData = new FormData(form);
    const requestBody = {};

    formData.forEach((value, key) => {
      requestBody[key] = value;
    });

    requestBody.role = role;

    if (requestBody.password !== requestBody.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!/^\d{10}$/.test(requestBody.mobile)) {
      alert("Mobile number must be exactly 10 digits!");
      return;
    }

    if (!requestBody.email.endsWith("@gmail.com")) {
      alert("Email must be a Gmail address (@gmail.com)!");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/users/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Signup successful! You can login on Home page.");
        form.reset();
      } else {
        alert(data.message || "Signup failed. Try again.");
      }
    } catch (error) {
      console.error("Signup Error:", error);
      alert("An error occurred. Please try again.");
    }
  }

  const managerSignupForm = document.getElementById("managerSignupForm");
  const employeeSignupForm = document.getElementById("employeeSignupForm");

  if (managerSignupForm) {
    managerSignupForm.addEventListener("submit", (event) =>
      handleSignup(event, "signup", "manager")
    );
  }

  if (employeeSignupForm) {
    employeeSignupForm.addEventListener("submit", (event) =>
      handleSignup(event, "signup", "employee")
    );
  }

});

//gallery handler
document.addEventListener("DOMContentLoaded", async () => {
  const galleryTableBody = document.getElementById("galleryTableBody");
  const imageModal = document.getElementById("imageModal");
  const modalImage = document.getElementById("modalImage");
  const closeModal = document.getElementById("closeModal");
  const viewAllBtn = document.getElementById("viewAllBtn");
  const addImageBtn = document.getElementById("addImageBtn");
  const addImageInput = document.getElementById("addImageInput");
  let allImages = [];
  let showingAll = false;

  async function fetchGalleryImages() {
    try {
      const response = await fetch("http://localhost:8080/gallery");
      allImages = await response.json();
      displayImages(false); // Initially show only 3 images
    } catch (error) {
      console.error("Error fetching gallery images:", error);
    }
  }

  function displayImages(showAll) {
    galleryTableBody.innerHTML = "";
    const imagesToShow = showAll ? allImages : allImages.slice(0, 3);

    imagesToShow.forEach((image) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td><img src="${image.image}" class="gallery-img border-2 border-gray-300 rounded-lg shadow-md hover:shadow-lg transition duration-300" data-id="${image.id}" style="width: 100px; cursor: pointer;"></td>
                <td class="space-x-2 text-right">
                    <input type="file" class="replace-input hidden" data-id="${image.id}">
                    <button class="replace-btn bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition duration-300" data-id="${image.id}">Replace</button>
                    <button class="delete-btn bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition duration-300 " data-id="${image.id}">Delete</button>
                </td>
            `;
      galleryTableBody.appendChild(row);
    });

    addEventListeners();
  }

  function addEventListeners() {
    document.querySelectorAll(".gallery-img").forEach((img) => {
      img.addEventListener("click", (event) => {
        modalImage.src = event.target.src;
        imageModal.classList.remove("hidden");
      });
    });

    document.querySelectorAll(".delete-btn").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        const imageId = event.target.dataset.id;
        try {
          await fetch(`http://localhost:8080/gallery/${imageId}`, {
            method: "DELETE",
          });
          allImages = allImages.filter((img) => img.id !== imageId);
          displayImages(showingAll);
          alert("Image deleted successfully!");
        } catch (error) {
          console.error("Error deleting image:", error);
        }
      });
    });

    document.querySelectorAll(".replace-btn").forEach((btn) => {
      btn.addEventListener("click", (event) => {
        const imageId = event.target.dataset.id;
        const fileInput = document.querySelector(
          `.replace-input[data-id='${imageId}']`
        );
        fileInput.click();
      });
    });

    document.querySelectorAll(".replace-input").forEach((input) => {
      input.addEventListener("change", async (event) => {
        const imageId = event.target.dataset.id;
        const file = event.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("image", file);

        try {
          const response = await fetch(
            `http://localhost:8080/gallery/${imageId}`,
            {
              method: "PUT",
              body: formData,
            }
          );
          const updatedImage = await response.json();
          allImages = allImages.map((img) =>
            img.id === imageId ? updatedImage : img
          );
          displayImages(showingAll);
          alert("Image replaced successfully!");
        } catch (error) {
          console.error("Error replacing image:", error);
        }
      });
    });
  }

  closeModal.addEventListener("click", () => {
    imageModal.classList.add("hidden");
  });

  viewAllBtn.addEventListener("click", () => {
    showingAll = !showingAll;
    displayImages(showingAll);
    viewAllBtn.textContent = showingAll ? "Show Less" : "View All";
  });

  addImageBtn.addEventListener("click", () => {
    addImageInput.click();
  });

  addImageInput.addEventListener("change", async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("http://localhost:8080/gallery", {
        method: "POST",
        body: formData,
      });
      const newImage = await response.json();
      allImages.push(newImage);
      displayImages(showingAll);
      alert("Image added successfully!");
    } catch (error) {
      console.error("Error adding image:", error);
    }
  });

  fetchGalleryImages();
});

//employee handler
document.addEventListener("DOMContentLoaded", async () => {
  const employeeTableBody = document.getElementById("employeeTableBody");
  const viewAllBtn = document.getElementById("viewAllEmployeesBtn");
  const numberOfemp = document.getElementById("number-of-employees");
  let allEmployees = [];
  let showingAll = false;

  async function fetchEmployees() {
    try {
      const response = await fetch("http://localhost:8080/employees");
      allEmployees = await response.json();
      numberOfemp.innerHTML = allEmployees.length;
      displayEmployees(false);
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  }

  function displayEmployees(showAll) {
    employeeTableBody.innerHTML = "";
    const employeesToShow = showAll ? allEmployees : allEmployees.slice(0, 4);

    employeesToShow.forEach((employee) => {
      const row = document.createElement("tr");
      row.classList.add("border-b");
      row.innerHTML = `
              <td class="py-2 px-4">${employee.id}</td>
              <td class="py-2 px-4">${employee.name}</td>
              <td class="py-2 px-4 text-right ${
                employee.status === "Active"
                  ? "text-green-600"
                  : "text-yellow-600"
              } ">${employee.status}</td>
              <td class="py-2 px-4 text-right">
                  
                   <button class="details-btn bg-blue-600 text-white p-2 rounded hover:bg-blue-700" data-id="${
                     employee.id
                   }">Details</button>
                  <button class="remove-btn bg-red-600 text-white p-2 rounded hover:bg-red-700" data-id="${
                    employee.id
                  }">Remove</button>
              </td>
          `;
      employeeTableBody.appendChild(row);
    });

    addEventListeners();
  }

  function addEventListeners() {
    document.querySelectorAll(".remove-btn").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        if (confirm("Are you sure you want to remove this employee?")) {
          const employeeId = event.target.dataset.id;
          try {
            await fetch(`http://localhost:8080/employees/${employeeId}`, {
              method: "DELETE",
            });
            allEmployees = allEmployees.filter((emp) => emp.id !== employeeId);
            displayEmployees(showingAll);
            alert("Employee removed successfully!");
          } catch (error) {
            console.error("Error removing employee:", error);
          }
        } else {
          return;
        }
      });
    });

    document.querySelectorAll(".details-btn").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        const employeeId = event.target.dataset.id;
        try {
          const response = await fetch(
            `http://localhost:8080/employees/details/${employeeId}`
          );
          const employee = await response.json();
          showEmployeePopup(employee);
        } catch (error) {
          console.error("Error fetching employee details:", error);
        }
      });
    });
  }

  function showEmployeePopup(employee) {
    const popup = document.createElement("div");
    popup.classList.add(
      "fixed",
      "top-0",
      "left-0",
      "w-full",
      "h-full",
      "bg-gray-800",
      "bg-opacity-50",
      "flex",
      "justify-center",
      "items-center"
    );
    popup.innerHTML = `
        <div class="bg-white p-6 rounded shadow-lg w-96">
            <h2 class="text-xl font-bold mb-4">Employee Details</h2>
            <p><strong>Name:</strong> ${employee.name}</p>
            <p><strong>Email:</strong> ${employee.email}</p>
            <p><strong>Mobile:</strong> ${employee.mobile}</p>
            <p><strong>Role:</strong> ${employee.role}</p>
            <p><strong>Status:</strong> <span class="${
              employee.status === "Active"
                ? "text-green-600"
                : "text-yellow-600"
            }">${employee.status}</span></p>
            <p><strong>Security Key:</strong> ${employee.security_key}</p>
            <button class="close-details-popup bg-red-600 text-white px-4 py-2 mt-4 rounded">Close</button>
        </div>
    `;
    document.body.appendChild(popup);

    document.querySelector(".close-details-popup").addEventListener("click", () => {
      popup.remove();
    });
  }

  viewAllBtn.addEventListener("click", () => {
    showingAll = !showingAll;
    displayEmployees(showingAll);
    viewAllBtn.textContent = showingAll ? "Show Less" : "View All";
  });

  setInterval(fetchEmployees, 2000);
});

//task handler
document.addEventListener("DOMContentLoaded", async () => {
  const taskTableBody = document.getElementById("taskTableBody");

  async function fetchTasks() {
    try {
      const response = await fetch("http://localhost:8080/tasks");
      const tasks = await response.json();
      displayTasks(tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }

  async function fetchEmployees() {
    try {
      const response = await fetch("http://localhost:8080/tasks/employees");
      return await response.json();
    } catch (error) {
      console.error("Error fetching employees:", error);
      return [];
    }
  }

  async function displayTasks(tasks) {
    const employees = await fetchEmployees();
    taskTableBody.innerHTML = "";

    tasks.forEach((task) => {
      const row = document.createElement("tr");
      row.classList.add("border-b");
      row.innerHTML = `
            <td class="py-2 px-4">${task.owner_name}</td>
              <td class="py-2 px-4">${task.car_number}</td>
              <td class="py-2 px-4">${task.contact_number}</td>
              <td class="py-2 px-4">${task.task_name}</td>
              <td class="py-2 px-4">
                  <select class="employee-select p-2 border rounded" data-task-id="${
                    task.id
                  }">
                      <option value="">Select Employee</option>
                      ${employees
                        .map(
                          (emp) => `
                          <option value="${emp.id}" ${
                            task.employee_id === emp.id ? "selected" : ""
                          }>${emp.name}</option>
                      `
                        )
                        .join("")}
                  </select>
              </td>
              <td class="py-2 px-4 ${
                task.employee_id ? "text-green-600" : "text-yellow-600"
              }">
                  ${task.employee_id ? "Assigned" : "To Be Assigned"}
              </td>
              <td class="py-2 px-4 ${
                task.status === "pending" ? "text-red-600" : "text-yellow-600"
              }">
                    ${
                      task.status === "completed"
                        ? `<button class="complete-btn bg-green-600 text-white p-2 rounded hover:bg-green-700" data-id="${task.id}" data-status="${task.status}">
                            Complete
                        </button>`
                        : task.status
                    }
                </td>
              
          `;
      taskTableBody.appendChild(row);
    });

    addEventListeners();
  }

  function addEventListeners() {
    document.querySelectorAll(".complete-btn").forEach((btn) => {
      btn.addEventListener("click", async (event) => {
        
        if(confirm("Great job the service is done \nMake sure you have informed the customer?")){ 

          const taskId = event.target.dataset.id;
          const status = event.currentTarget.getAttribute("data-status");
          

          try {
            await fetch(`http://localhost:8080/tasks/${taskId}`, {
              method: "DELETE",
            });
            socket.send(JSON.stringify({ type: "update" }));
          } catch (error) {
            console.error("Error completing task:", error);
          }
          
          try {
            await fetch(`http://localhost:8080/bookings/status/${taskId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ status }),
            });
            fetchTasks();
          } catch (error) {
            console.error("Error updating task status:", error);
          }
      }else{
        return;
      }
      });
    });

    document.querySelectorAll(".employee-select").forEach((select) => {
      select.addEventListener("change", async (event) => {
        const taskId = event.target.dataset.taskId;
        const employeeId = event.target.value;

        try {
          await fetch(`http://localhost:8080/tasks/assign/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ employeeId }),
          });
          fetchTasks();
        } catch (error) {
          console.error("Error assigning task:", error);
        }
      });
    });

    document.querySelectorAll(".status-select").forEach((select) => {
      select.addEventListener("change", async (event) => {
        const taskId = event.target.dataset.taskId;
        const status = event.target.value;

        try {
          await fetch(`http://localhost:8080/tasks/status/${taskId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ status }),
          });
          fetchTasks();
        } catch (error) {
          console.error("Error updating task status:", error);
        }
        
      });
    });
  }

  async function fetchTaskCounts() {
    try {
      const response = await fetch("http://localhost:8080/tasks/counts");
      const data = await response.json();

      document.getElementById("pending-tasks").textContent = data.pending;
      document.getElementById("active-projects").textContent = data.active;
    } catch (error) {
      console.error("Error fetching task counts:", error);
    }
  }

  // Call the function when the page loads
  fetchTaskCounts();

  // Refresh the data every 10 seconds
  setInterval(fetchTaskCounts, 10000);

  setInterval(fetchTasks, 4000);
});

//notification handler
document.addEventListener("DOMContentLoaded", function () {
  const notificationList = document.getElementById("notification-list");
  const viewAllBtn = document.getElementById("view-all-noti");
  let notifications = [];
  let showAll = false;
  let newNotification = 0 ;

  // Function to fetch notifications from the backend
  function fetchNotifications() {
    fetch("http://localhost:8080/notifications")
      .then((response) => response.json())
      .then((data) => {
        if (JSON.stringify(notifications) !== JSON.stringify(data)) {
          notifications = data;
          renderNotifications();
          playNotificationSound();
        }
      })
      .catch((error) => console.error("Error fetching notifications:", error));

    if (notifications.length === 0) {
      notificationList.innerHTML =
        "<p class='text-gray-500'>No new tasks assigned</p>";
      viewAllBtn.classList.add("hidden");
      return;
    }
  }

  // Function to render notifications in the UI
  function renderNotifications() {
    notificationList.innerHTML = "";
    let visibleNotifications = showAll
      ? notifications
      : notifications.slice(-3);

    visibleNotifications.forEach((notif) => {
      const formattedDate = new Date(notif.booking_date).toLocaleDateString(
        "en-GB",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      );

      const formattedTime = notif.booking_time.slice(0, 5);

      const li = document.createElement("li");
      li.className = "bg-gray-100 p-4 rounded-lg shadow";
      li.innerHTML = `
    <div class="flex justify-between items-center">
        <div>
            <p class="text-gray-700 font-semibold">
                ${notif.user_name} is requesting ${notif.service_name} on ${formattedDate} at ${formattedTime}
            </p>
            <p class="text-gray-500 text-sm">${notif.time_ago}</p>
        </div>
        <div class="flex gap-2">
            <button class=" bg-blue-500 text-white px-3 py-1 rounded change-time-btn" data-id="${notif.booking_id} " service-name="${notif.service_name}">
                Change Time
            </button>
            <button class=" bg-green-500 text-white px-3 py-1 rounded confirm-btn" data-id="${notif.booking_id}" service-name="${notif.service_name}">
                Confirm
            </button>
        </div>
    </div>
`;
      notificationList.appendChild(li);
    });
  }

    // Play notification sound
    function playNotificationSound() {
     
        if (notifications.length <= newNotification) {
          newNotification = notifications.length;
          return;
        }
        const audio = new Audio("../assets/sounds/notification.mp3");
        audio.play();
        newNotification = notifications.length;
    }

  // Event delegation for Confirm and Change Time buttons
  notificationList.addEventListener("click", function (event) {
    const bookingId = event.target.getAttribute("data-id");
    const serviceName = event.target.getAttribute("service-name");

    if (event.target.classList.contains("confirm-btn")) {
      confirmBooking(bookingId, managerId, serviceName);
    } else if (event.target.classList.contains("change-time-btn")) {
      openTimeChangePopup(bookingId, managerId, serviceName);
    }
  });

  // Confirm booking
  function confirmBooking(bookingId, managerId, serviceName) {
    fetch(`http://localhost:8080/notifications/confirm/${bookingId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ managerId: managerId, service_name: serviceName }), // ✅ Sending as JSON object
    })
      .then((response) => response.text())
      .then((data) => {
        console.log(data);
        fetchNotifications();
      })
      .catch((error) => console.error("Error:", error));
    removeNotification(bookingId);
  }

  function removeNotification(bookingId) {
    notifications = notifications.filter(
      (notif) => notif.booking_id !== bookingId
    );
    renderNotifications();
  }

  // Open time change popup
  function openTimeChangePopup(bookingId) {
    const newDate = prompt("Enter new date (YYYY-MM-DD):");
    const newTime = prompt("Enter new time (HH:MM):");
    if (newDate && newTime) {
      fetch(`http://localhost:8080/notifications/change-time/${bookingId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          { booking_date: newDate, booking_time: newTime },
          managerId
        ),
      }).then(() => fetchNotifications());
    }
  }

  // Toggle View All notifications
  viewAllBtn.addEventListener("click", function () {
    showAll = !showAll;
    renderNotifications();
    viewAllBtn.textContent = showAll ? "Show Less" : "View All";
  });

  // Fetch notifications every 2 seconds
  setInterval(fetchNotifications, 2000);
  fetchNotifications(); // Initial fetch
});

// JavaScript: Fetch and Display Customers
document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("customerTableBody");
  const customerPopup = document.getElementById("customerPopup");
  const customerDetails = document.getElementById("customerDetails");
  const closePopup = document.getElementById("closePopup");
  let customers = [];
  
  // Function to fetch customers from the backend
  function fetchCustomers() {
      fetch("http://localhost:8080/bookings/customers")
          .then(response => response.json())
          .then(data => {
              if (JSON.stringify(customers) !== JSON.stringify(data)) {
                  customers = data;
                  renderCustomers();
              }
          })
          .catch(error => console.error("Error fetching customers:", error));
  }

  
  // Function to render customers in the table
  function renderCustomers() {
      tableBody.innerHTML = "";
      customers.forEach((customer, index) => {
          const row = document.createElement("tr");
          row.className = "border-b";
          row.innerHTML = `
              <td class="py-2 px-4">${index + 1}</td>
              <td class="py-2 px-4">${customer.name}</td>
              <td class="py-2 px-4">${customer.latest_review || "No Review"}</td>
              <td class="py-2 px-4">
                  <button class="customer-details-btn bg-blue-500 text-white px-3 py-1 rounded" data-id="${customer.id}">Details</button>
                  <button class="block-btn bg-red-500 text-white px-3 py-1 rounded ml-2" data-id="${customer.id}">Block</button>
              </td>
          `;
          tableBody.appendChild(row);
      });
  }
  
  // Event delegation for Details and Block buttons
  document.addEventListener("click", (event) => {
      const customerId = event.target.dataset.id;
      if (event.target.classList.contains("customer-details-btn")) {
          fetchCustomerDetails(customerId);
      } else if (event.target.classList.contains("block-btn")) {
          blockCustomer(customerId);
      }
  });
  
  // Fetch customer details and show in popup
  function fetchCustomerDetails(customerId) {
      fetch(`http://localhost:8080/users/customer/${customerId}`)
          .then(response => response.json())
          .then(customer => {
            customerDetails.innerHTML = `
            <h3 class="text-lg font-semibold">Personal Details</h3>
            <p><strong>Name:</strong> ${customer.customer.name}</p>
            <p><strong>Email:</strong> ${customer.customer.email}</p>
            <p><strong>Mobile:</strong> ${customer.customer.mobile}</p>
            <hr class="my-2">
            
            <h3 class="text-lg font-semibold">Reviews</h3>
            <p>${customer.reviews || "No Reviews Yet"}</p>
            <hr class="my-2">
        
            <h3 class="text-lg font-semibold">Car Details</h3>
            ${customer.currentBookings.length > 0 ? 
                `<p><strong>Car Number:</strong> ${customer.currentBookings[0].car_number}</p>` : 
                "<p>No Details</p>"
            }
            <hr class="my-2">
        
            <h3 class="text-lg font-semibold">Services Used</h3>
            ${
                customer.bookingHistory.length > 0 ? 
                customer.bookingHistory.slice(0, 2).map(history => `
                    <p> ${history.booking_id},
                    ${history.booking_date},
                    ${history.booking_time}</p>
                    <hr class="my-2">
                `).join('') : 
                "<p>No Services Used</p>"
            }
        `;
        
        customerPopup.classList.remove("hidden");
                   console.log(customer);
          });
          
  }
  
  // Block customer
  function blockCustomer(customerId) {
      fetch(`http://localhost:8080/users/block/${customerId}`, { method: "POST" })
          .then(response => response.text())
          .then(() => fetchCustomers());
  }
  
  // Close popup
  closePopup.addEventListener("click", () => {
      customerPopup.classList.add("hidden");
  });
  
  // Fetch customers every 5 seconds-
  fetchCustomers(); // Initial fetch
});




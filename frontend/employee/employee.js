const params = new URLSearchParams(window.location.search);
const employeeId = params.get("userId");
const link = "http://localhost:8080/";

window.addEventListener("load", () => {

  const horn = new Audio("../assets/sounds/horn.mp3");
  horn.play();
// Ensures it plays only once per page load
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
    sidebarProfileName.textContent = "John Doe"; // Set sidebar profile name
    sidebarProfilePost.textContent = "Employee"; // Set sidebar profile post
  });

  document.addEventListener("click", function (event) {
    if (
      !profileSidebar.contains(event.target) &&
      event.target !== profileImage
    ) {
      profileSidebar.classList.add("hidden");
      profileImage.classList.remove("hidden"); // Show profile image
      logoutBtn.classList.remove("hidden"); // Show logout button
    }
  });
});

document.getElementById("clientImage").addEventListener("click", function () {
  document.getElementById("profileSidebar").classList.toggle("active");
});

//employee status handler 
document.addEventListener("DOMContentLoaded", async () => {
  const employeeStatusBtn = document.getElementById("status-btn");

  async function updateButton(status) {
    employeeStatusBtn.textContent = status === "Active" ? "Deactivate" : "Activate";

    // Remove both colors before adding the correct one
    employeeStatusBtn.classList.remove("bg-green-500", "bg-orange-500");

    // Apply new color based on status
    if (status === "Active") {
        employeeStatusBtn.classList.add("bg-red-500");  // Active → Green
    } else {
        employeeStatusBtn.classList.add("bg-green-500"); // Inactive → Orange
    }
}

  employeeStatusBtn.addEventListener("click", async () => {
    
      try {
          await fetch(`${link}employees/${employeeId}/toggle-status`, { method: "PUT" });

          const updatedStatus = employeeStatusBtn.textContent === "Activate" ? "Active" : "Inactive";
          updateButton(updatedStatus);

      } catch (error) {
          console.error("Error updating employee status:", error);
      }
  });

});

async function fetchTaskCounts(employeeId) {
  try {
      const response = await fetch(`${link}tasks/counts/${employeeId}`);
      const data = await response.json();

      document.getElementById("assigned-tasks").textContent = data.assigned;
      document.getElementById("completed-tasks").textContent = data.completed;
      document.getElementById("pending-tasks").textContent = data.pending;

  } catch (error) {
      console.error("Error fetching task counts:", error);
  }
}

// Fetch task counts when the page loads (Replace `employeeId` with actual logged-in employee's ID)
document.addEventListener("DOMContentLoaded", () => { 
   setInterval(()=>{
     fetchTaskCounts(employeeId);
   },2000);

});

//notification and task list handler
document.addEventListener("DOMContentLoaded", async () => {
  
  const notificationsList = document.getElementById("notifications-list");
  const taskTableBody = document.querySelector("#tasks tbody");
  const viewAllNotiBtn = document.getElementById("view-all-noti");
  const viewAllTasksBtn = document.getElementById("view-all-tasks");
  let allTasks = [];
  let showingAllNoti = false;
  let showingAllTasks = false;
  let newNotification = 0;

  async function fetchTasks() {
      try {
          const response = await fetch(`${link}tasks/${employeeId}`);
          const newTasks = await response.json();

          if (JSON.stringify(newTasks) !== JSON.stringify(allTasks)) {
              allTasks = newTasks;
              displayNotifications(false);
              displayTaskList(false);
              playNotificationSound();
          }
      } catch (error) {
          console.error("Error fetching tasks:", error);
      }
  }

  // Play notification sound
  function playNotificationSound() {
    if (allTasks.length <= newNotification) {
      newNotification = allTasks.length;
      return;
    }
    const audio = new Audio("../assets/sounds/notification.mp3");
    audio.play();
    newNotification = allTasks.length;
}

  function displayNotifications(showAll) {
      notificationsList.innerHTML = "";
      const tasksToShow = showAll ? allTasks : allTasks.slice(0, 3);

      if (tasksToShow.length === 0) {
          notificationsList.innerHTML = "<p class='text-gray-500'>No new tasks assigned</p>";
          viewAllNotiBtn.classList.add("hidden");
          return;
      }

      tasksToShow.forEach(task => {
          const li = document.createElement("li");
          li.classList.add("bg-gray-100", "p-4", "rounded-lg", "shadow");
          li.innerHTML = `
              <p class="text-gray-700 font-semibold">New task assigned: ${task.task_name} for ${task.car_number}</p>
              <p class="text-gray-500 text-sm">Status: ${task.status}</p>
          `;
          notificationsList.appendChild(li);
      });

      viewAllNotiBtn.classList.toggle("hidden", allTasks.length <= 3);
  }

  function displayTaskList(showAll) {
      taskTableBody.innerHTML = "";
      const tasksToShow = showAll ? allTasks : allTasks.slice(0, 3);

      tasksToShow.forEach(task => {
          if (task.status === "Completed") return;
        
          const row = document.createElement("tr");
          row.classList.add("border-b");
          row.innerHTML = `
              <td class="py-2 px-4">${task.task_name}</td>
              <td class="py-2 px-4">${task.car_number}</td>
              <td class="py-2 px-4">
                  <button class="status-btn px-3 py-1 rounded text-white transition duration-300 ${getStatusColor(task.status)}" 
                      data-id="${task.id}" data-status="${task.status}">
                      ${getStatusButton(task.status)}
                  </button>
              </td>
          `;
          taskTableBody.appendChild(row);
      });

      viewAllTasksBtn.classList.toggle("hidden", allTasks.length <= 3);
      addStatusEventListeners();
  }

  function getStatusButton(status) {

      if (status === "pending") return `<i class="fas fa-clock"></i> Pending`;
      if (status === "in-progress") return `<i class="fas fa-spinner"></i> In Progress`;
      if (status === "completed") return `Completed`;

      return "";
  }

  function getStatusColor(status) {
    
      if (status === "pending") return "bg-gray-500 hover:bg-gray-700";
      if (status === "in-progress") return "bg-yellow-500 hover:bg-yellow-700";
      if (status === "completed") return "bg-green-500 hover:bg-green-700";
      return "";
  }

  function addStatusEventListeners() {
    document.querySelectorAll(".status-btn").forEach(btn => {
      btn.addEventListener("click", async (event) => {
          const btnElement = event.currentTarget; // Ensure correct element
          const taskId = btnElement.getAttribute("data-id"); // Fetch task ID
        let currentStatus = btnElement.getAttribute("data-status");
          
              let newStatus;

              if (currentStatus === "pending") newStatus = "in-progress";
              else if (currentStatus === "in-progress") {
                if(!confirm("Well Done \n You have completed your work\nBy clicking ok your taskwill be remove from the task list")){return;}
                newStatus = "completed"
              }
              else return;

              try {
                  await fetch(`${link}tasks/status/${taskId}`, {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ status: newStatus })
                  });

                  allTasks = allTasks.map(task =>
                      task.id === taskId ? { ...task, status: newStatus } : task
                  );

                  displayTaskList(showingAllTasks);
              } catch (error) {
                  console.error("Error updating task status:", error);
              }
          });
      });
  }

  viewAllNotiBtn.addEventListener("click", () => {
      showingAllNoti = !showingAllNoti;
      displayNotifications(showingAllNoti);
      viewAllNotiBtn.textContent = showingAllNoti ? "Show Less" : "View All";
  });

  viewAllTasksBtn.addEventListener("click", () => {
      showingAllTasks = !showingAllTasks;
      displayTaskList(showingAllTasks);
      viewAllTasksBtn.textContent = showingAllTasks ? "Show Less" : "View All";
  });

  await fetchTasks();
  setInterval(fetchTasks, 2000);
});




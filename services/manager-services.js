document.addEventListener("DOMContentLoaded", () => {
    const servicesGrid = document.querySelector(".services-grid");
    const addServiceBtn = document.getElementById("add-service-btn");
    const addPopup = document.getElementById("add-popup");
    const editPopup = document.getElementById("edit-popup");
    const confirmPopup = document.getElementById("confirm-popup");

    const newServiceName = document.getElementById("new-service-name");
    const newServicePrice = document.getElementById("new-service-price");
    const newServiceImage = document.querySelector("#new-service-image");
    const newServiceDescription = document.getElementById("new-service-description");
    const addSaveBtn = document.getElementById("add-save-btn");
    
    const serviceName = document.getElementById("service-name");
    const servicePrice = document.getElementById("service-price");
    const serviceImage = document.querySelector("#service-image");
    const serviceDescription = document.getElementById("service-description");
    const saveBtn = document.getElementById("save-btn");
    
    const confirmDeleteBtn = document.getElementById("confirm-delete-btn");
    const cancelBtn = document.querySelectorAll(".cancel-btn");

    let editingServiceId = null;
    let deletingServiceId = null;
    let managerId = 1 ;

    // Fetch and display services from the database
    async function fetchServices() {
        try {
            const response = await fetch("http://localhost:8080/services");
            const services = await response.json();
            renderServices(services);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    }
    
    async function getServiceImageUrl(serviceId) {
        try {
            const response = await fetch(`http://localhost:8080/services/image/${serviceId}`);
    
            if (!response.ok) {
                throw new Error("Image not found");
            }
    
            const blob = await response.blob();
            return URL.createObjectURL(blob); // Create URL for the fetched image
        } catch (error) {
            console.error(`Error fetching image for service ID ${serviceId}:`, error);
            return "default-image.jpg"; // Use a default image if fetching fails
        }
    }
    
    async function renderServices(services) {
        servicesGrid.innerHTML = "";
    
        for (const service of services) {
            const serviceCard = document.createElement("div");
            serviceCard.classList.add("service-card");
            serviceCard.dataset.serviceId = service.service_id;
    
            // Fetch image URL asynchronously
            const imageUrl = await getServiceImageUrl(service.service_id);
    
            serviceCard.innerHTML = `
                <img src="${imageUrl}" alt="${service.service_name}" class=" p-4 rounded-3xl w-full h-56 w-65  object-cover">
                <h3>${service.service_name}</h3>
                <p>Price: ₹${service.price}</p>
                <p>${service.description}</p>
                <div class="actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;
    
            serviceCard.querySelector(".edit-btn").addEventListener("click", () => openEditPopup(service));
            serviceCard.querySelector(".delete-btn").addEventListener("click", () => openDeletePopup(service.service_id));
    
            servicesGrid.appendChild(serviceCard);
        }
    }
    

    function openEditPopup(service) {
        editingServiceId = service.service_id;
        serviceName.value = service.service_name;
        servicePrice.value = service.price;
        serviceDescription.value = service.description;
        editPopup.classList.remove("hidden");
    }

    function openDeletePopup(serviceId) {
        deletingServiceId = serviceId;
        confirmPopup.classList.remove("hidden");
    }

    addServiceBtn.addEventListener("click", () => {
        addPopup.classList.remove("hidden");
    });

    cancelBtn.forEach(btn =>{
        btn.addEventListener("click", () => {
        editPopup.classList.add("hidden");
        confirmPopup.classList.add("hidden");
        addPopup.classList.add("hidden");
    });
    });


addSaveBtn.addEventListener("click", async () => {

    const formData = new FormData();
    formData.append("name", newServiceName.value);
    formData.append("price", newServicePrice.value);
    formData.append("description", newServiceDescription.value);
    
    if (newServiceImage.files.length > 0) {
        formData.append("image", newServiceImage.files[0]); // Correct way to send file
    } else {
        alert("Please select an image!");
        return;
    }
    
    formData.append("manager_id", managerId);

    try {
        const response = await fetch("http://localhost:8080/services", {
            method: "POST",
            body: formData // No need to set Content-Type manually
        });

        if (response.ok) {
            fetchServices();
            alert("Service added successfully!");
            addPopup.classList.add("hidden");
        } else {
            alert("Error in adding service");
        }
    } catch (error) {
        console.error("Error in adding service:", error);
    }
});


saveBtn.addEventListener("click", async () => {
    const formData = new FormData();
    formData.append("id", editingServiceId);
    formData.append("name", serviceName.value);
    formData.append("price", servicePrice.value);
    formData.append("description", serviceDescription.value);
    formData.append("manager_id", managerId);

    // Append image only if a new one is selected
    if (serviceImage.files.length > 0) {
        formData.append("image", serviceImage.files[0]);
    }
    
    try {
        const response = await fetch(`http://localhost:8080/services/${editingServiceId}`, {
            method: "PUT",
            body: formData // No need to set Content-Type manually for FormData
        });

        if (response.ok) {
            fetchServices();
            alert("Service updated successfully!");
            editPopup.classList.add("hidden");
        } else {
            alert("Error updating service.");
        }
    } catch (error) {
        console.error("Error updating service:", error);
    }
});


    confirmDeleteBtn.addEventListener("click", async () => {
        try {
            const response = await fetch(`http://localhost:8080/services/${deletingServiceId}`, {
                method: "DELETE"
            });

            if (response.ok) {
                fetchServices();
                alert("Service deleted successfully!");
                confirmPopup.classList.add("hidden");
            }
        } catch (error) {
            console.error("Error deleting service:", error);
        }
    });

    fetchServices();
});

document.addEventListener("DOMContentLoaded", function () {
    function handleImagePreview(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        input.addEventListener("change", function (event) {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    preview.src = e.target.result;
                    preview.classList.remove("hidden");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    handleImagePreview("new-service-image", "new-service-preview");
    handleImagePreview("service-image", "service-preview");
});
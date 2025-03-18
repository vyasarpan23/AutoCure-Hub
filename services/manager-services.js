document.addEventListener("DOMContentLoaded", () => {
    const servicesGrid = document.querySelector(".services-grid");
    const addServiceBtn = document.getElementById("add-service-btn");
    const addPopup = document.getElementById("add-popup");
    const editPopup = document.getElementById("edit-popup");
    const confirmPopup = document.getElementById("confirm-popup");

    const newServiceName = document.getElementById("new-service-name");
    const newServicePrice = document.getElementById("new-service-price");
    const newServiceDescription = document.getElementById("new-service-description");
    const addSaveBtn = document.getElementById("add-save-btn");
    
    const serviceName = document.getElementById("service-name");
    const servicePrice = document.getElementById("service-price");
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

    function renderServices(services) {
        servicesGrid.innerHTML = "";
        services.forEach(service => {
            const serviceCard = document.createElement("div");
            serviceCard.classList.add("service-card");
            serviceCard.dataset.serviceId = service.id;

            serviceCard.innerHTML = `
                <h3>${service.name}</h3>
                <p>Price: ₹${service.price}</p>
                <p>${service.description}</p>
                <div class="actions">
                    <button class="edit-btn">Edit</button>
                    <button class="delete-btn">Delete</button>
                </div>
            `;

            serviceCard.querySelector(".edit-btn").addEventListener("click", () => openEditPopup(service));
            serviceCard.querySelector(".delete-btn").addEventListener("click", () => openDeletePopup(service.id));
            
            servicesGrid.appendChild(serviceCard);
        });
    }

    function openEditPopup(service) {
        editingServiceId = service.id;
        serviceName.value = service.name;
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
        const serviceData = {
            name: newServiceName.value,
            price: newServicePrice.value,
            description: newServiceDescription.value,
            manager_id : managerId 
        };

        try {
            const response = await fetch("http://localhost:8080/services", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(serviceData)
            });

            if (response.ok) {
                fetchServices();
                alert("Service added successfully!");
                addPopup.classList.add("hidden");
            }
        } catch (error) {
            console.error("Error in adding service:", error);
        }
    });

    saveBtn.addEventListener("click", async () => {
        const serviceData = {
            id: editingServiceId,
            name: serviceName.value,
            price: servicePrice.value,
            description: serviceDescription.value,
            manager_id : managerId 
        };

        try {
            const response = await fetch(`http://localhost:8080/services/${editingServiceId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(serviceData)
            });

            if (response.ok) {
                fetchServices();
                alert("Service Updated successfully!");
                editPopup.classList.add("hidden");
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

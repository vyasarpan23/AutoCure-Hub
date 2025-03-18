document.addEventListener("DOMContentLoaded", () => {
    const servicesGrid = document.querySelector(".services-grid");
    let selectedServices = new Set(); // Use Set to track selected services

    // Function to fetch services from the database
    async function fetchServices() {
        try {
            const response = await fetch("/api/services"); // Replace with actual API endpoint
            const services = await response.json();
            renderServices(services);
        } catch (error) {
            console.error("Error fetching services:", error);
        }
    }

    // Function to render services dynamically
    function renderServices(services) {
        servicesGrid.innerHTML = ""; // Clear existing services
        services.forEach(service => {
            const serviceCard = document.createElement("div");
            serviceCard.classList.add("service-card");
            serviceCard.dataset.serviceId = service.id;
            
            serviceCard.innerHTML = `
                <h3>${service.name}</h3>
                <p>Price: ₹${service.price}</p>
                <p>${service.description}</p>
                <div class="actions">
                    <button class="add-btn">Add To Cart</button>
                </div>
            `;
            
            const addButton = serviceCard.querySelector(".add-btn");
            addButton.addEventListener("click", () => toggleService(service.id, addButton));
            
            servicesGrid.appendChild(serviceCard);
        });
    }

    // Function to add/remove service from cart
    function toggleService(serviceId, button) {
        if (selectedServices.has(serviceId)) {
            selectedServices.delete(serviceId);
            button.textContent = "Add To Cart";
            button.classList.remove("selected");
        } else {
            selectedServices.add(serviceId);
            button.textContent = "Remove From Cart";
            button.classList.add("selected");
        }
        console.log("Selected Services:", Array.from(selectedServices));
    }

    // Fetch services on page load
    fetchServices();
});

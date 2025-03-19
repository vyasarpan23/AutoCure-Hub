document.addEventListener("DOMContentLoaded", () => {
    const servicesGrid = document.querySelector(".services-grid");
    const cartItemsList = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    let selectedServices = new Map(); // Store selected services with details

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
                <h3>${service.service_id}. ${service.service_name}</h3>
                <p>Price: ₹${service.price}</p>
                <p>${service.description}</p>
                <div class="actions">
                    <button class="add-to-cart-btn">Add to cart</button>
                </div>
            `;

            serviceCard.querySelector(".add-to-cart-btn").addEventListener("click", () => {
                toggleService(service, serviceCard.querySelector(".add-to-cart-btn"));
            });
            
            servicesGrid.appendChild(serviceCard);
        });
    }

    function toggleService(service, button) {
        if (selectedServices.has(service.service_id)) {
            selectedServices.delete(service.service_id);
            button.textContent = "Add To Cart";
            button.style.backgroundColor = "#1ec66a";
            button.classList.remove("selected");
        } else {
            selectedServices.set(service.service_id, service);
            button.textContent = "Remove From Cart";
            button.style.backgroundColor = "blue";
            button.classList.add("selected");
        }
        updateCart();
    }

    function updateCart() {
        cartItemsList.innerHTML = "";
        let total = 0;
        selectedServices.forEach(service => {
            const listItem = document.createElement("li");
            listItem.textContent = `${service.service_name} - ₹${service.price}`;
            cartItemsList.appendChild(listItem);
            total += service.price;
        });
        cartTotal.textContent = total.toFixed(2);
    }

    function clearCart() {
        selectedServices.clear();
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            button.textContent = "Add To Cart";
            button.style.backgroundColor = "#1ec66a";
            button.classList.remove("selected");
        });
        updateCart();
    }

    function confirmCart() {
        if (selectedServices.size === 0) {
            alert("Your cart is empty!");
            return;
        }
        alert("Order confirmed! Thank you for your purchase.");
        clearCart();
    }

    fetchServices();

    window.clearCart = clearCart;
    window.confirmCart = confirmCart;
});

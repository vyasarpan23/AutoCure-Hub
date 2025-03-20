document.addEventListener("DOMContentLoaded", () => {
    const servicesGrid = document.querySelector(".services-grid");
    const cartBtn = document.getElementById("cartBtn");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartPopup = document.getElementById("cartPopup");
    const cartItemsList = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");
    let selectedServices = new Map();

    const checkoutOverlay = document.getElementById("checkoutOverlay");
    const checkoutPopup = document.getElementById("checkoutPopup");
    const cancelOverlay = document.getElementById("cancelOverlay");
    const cancelPopup = document.getElementById("cancelPopup");

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
                <h3>${service.service_name}</h3>
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
        } else {
            selectedServices.set(service.service_id, service);
            button.textContent = "Remove From Cart";
            button.style.backgroundColor = "blue";
        }
        updateCart();
        updateCartCount();
    }

    function updateCart() {
        cartItemsList.innerHTML = "";
        let total = 0;
        
        selectedServices.forEach(service => {
            const listItem = document.createElement("li");
            listItem.textContent = `${service.service_name} - ₹${service.price}`;
            cartItemsList.appendChild(listItem);
            total += parseFloat(service.price);
        });
    
        cartTotal.textContent = total.toFixed(2);
        
        // Adjust cart size dynamically
        const cartPopup = document.getElementById("cartPopup");
        cartPopup.style.height = "auto"; // Let it expand naturally
        cartPopup.style.maxHeight = "60vh"; // Prevent it from growing too much
    

    }

    function updateCartCount() {
        const cartCount = document.getElementById("cartCount");
        cartCount.textContent = selectedServices.size;
    }
    

    function clearCart() {
        selectedServices.clear();
        document.querySelectorAll(".add-to-cart-btn").forEach(button => {
            button.textContent = "Add To Cart";
            button.style.backgroundColor = "#1ec66a";
        });
        updateCart();
        closeCart();
    }

    function openCart() {
        cartOverlay.style.display = "block";
        cartPopup.style.display = "block";
    }

    function closeCart() {
        cartOverlay.style.display = "none";
        cartPopup.style.display = "none";
    }

    function openCheckout() {
        closeCart();
        if (selectedServices.size === 0) {
            alert("Your cart is empty!");
            return;
        }
        checkoutOverlay.style.display = "block";
        checkoutPopup.style.display = "block";
    }

    function closeCheckout() {
        checkoutOverlay.style.display = "none";
        checkoutPopup.style.display = "none";
    }

    function confirmBooking() {
        alert("Waiting for the manager's Confirmation \n You will be notified soon.");
        closeCheckout();
        clearCart();
    }

    async function confirmBooking() {
        // Get input values
        let ownerName = document.getElementById("owner-name").value.trim();
        let carNumber = document.getElementById("car-number").value.trim();
        let contactNumber = document.getElementById("contact-number").value.trim();
        let serviceDate = document.getElementById("service-date").value;
        let serviceTime = document.getElementById("service-time").value;
    
        // Basic validation
        if (!ownerName || !carNumber || !contactNumber || !serviceDate || !serviceTime) {
            alert("Please fill in all fields.");
            return;
        }
    
        // Validate contact number (10 digits)
        let phonePattern = /^[0-9]{10}$/;
        if (!phonePattern.test(contactNumber)) {
            alert("Please enter a valid 10-digit contact number.");
            return;
        }
    
        // Validate car number (basic alphanumeric check)
        let carNumberPattern = /^[A-Z0-9- ]+$/i;
        if (!carNumberPattern.test(carNumber)) {
            alert("Please enter a valid car number.");
            return;
        }
    
        // Prepare data to send
        const bookingData = {
            ownerName,
            carNumber,
            contactNumber,
            serviceDate,
            serviceTime
        };
    
        try {
            const response = await fetch("http://localhost:8080/bookings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookingData)
            });
    
            const result = await response.json();
            if (response.ok) {
                alert("Waiting for the manager's Confirmation \n You will be notified soon.");
                closeCheckout();
            } else {
                alert("Booking failed: " + result.message);
            }
        } catch (error) {
            console.error("Error:", error);
            alert("An error occurred while processing your booking.");
        }
        closeCheckout();
        clearCart();
    }
    

    function openCancelPopup() {
        cancelOverlay.style.display = "block";
        cancelPopup.style.display = "block";
    }

    function closeCancelPopup() {
        cancelOverlay.style.display = "none";
        cancelPopup.style.display = "none";
    }

    function confirmCancellation() {
        alert("Booking canceled successfully.");
        closeCancelPopup();
        clearCart();
    }

    cartBtn.addEventListener("click",openCart);
    cartOverlay.addEventListener("click", closeCart);
    checkoutOverlay.addEventListener("click", closeCheckout);
    cancelOverlay.addEventListener("click", closeCancelPopup);

    fetchServices();

    window.clearCart = clearCart;
    window.openCheckout = openCheckout;
    window.closeCheckout = closeCheckout;
    window.confirmBooking = confirmBooking;
    window.openCancelPopup = openCancelPopup;
    window.closeCancelPopup = closeCancelPopup;
    window.confirmCancellation = confirmCancellation;
});

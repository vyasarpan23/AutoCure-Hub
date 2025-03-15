document.addEventListener("DOMContentLoaded", () => {
    const cartBtn = document.getElementById("cartBtn");
    const cartPopup = document.getElementById("cartPopup");
    const cartOverlay = document.getElementById("cartOverlay");
    const cartItemsList = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");
    const cartCount = document.getElementById("cartCount");

    const checkoutPopup = document.getElementById("checkoutPopup");
    const checkoutOverlay = document.getElementById("checkoutOverlay");

    let cart = [];

    // Function to add service to the cart
    function addToCart(serviceName, price) {
        cart.push({ serviceName, price });
        updateCartUI();
    }

    // Update Cart UI
    function updateCartUI() {
        cartItemsList.innerHTML = "";
        let total = 0;

        cart.forEach((item, index) => {
            total += item.price;
            const li = document.createElement("li");
            li.innerHTML = `${item.serviceName} - ₹${item.price} 
                <button onclick="removeFromCart(${index})">Remove</button>`;
            cartItemsList.appendChild(li);
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cart.length;
    }

    // Remove item from cart
    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        updateCartUI();
    };

    // Open Cart
    cartBtn.addEventListener("click", () => {
        cartPopup.style.display = "block";
        cartOverlay.style.display = "block";
    });

    // Close Cart
    window.closeCart = function () {
        cartPopup.style.display = "none";
        cartOverlay.style.display = "none";
    };

    // Open Checkout Form
    window.openCheckout = function () {
        cartPopup.style.display = "none";
        cartOverlay.style.display = "none";

        checkoutPopup.style.display = "block";
        checkoutOverlay.style.display = "block";

        // Show number of services in the checkout form
        const serviceCount = document.createElement("p");
        serviceCount.innerHTML = `<strong>Number of Services Selected:</strong> ${cart.length}`;
        checkoutPopup.insertBefore(serviceCount, checkoutPopup.firstChild);
    };

    // Close Checkout Form
    window.closeCheckout = function () {
        checkoutPopup.style.display = "none";
        checkoutOverlay.style.display = "none";
    };

    // Confirm Booking
    window.confirmBooking = function () {
        alert("Your booking has been confirmed!");
        closeCheckout();
        cart = [];
        updateCartUI();
    };

    // Attach event listeners to Add to Cart buttons
    document.querySelectorAll(".add-to-cart").forEach(button => {
        button.addEventListener("click", function () {
            const serviceName = this.getAttribute("data-name");
            const price = parseFloat(this.getAttribute("data-price"));
            addToCart(serviceName, price);
        });
    });
});

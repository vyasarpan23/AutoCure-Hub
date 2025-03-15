document.addEventListener("DOMContentLoaded", () => {
    const cartItemsList = document.getElementById("cartItems");
    const cartTotal = document.getElementById("cartTotal");

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

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
    }

    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
    };

    window.clearCart = function () {
        cart = [];
        localStorage.setItem("cart", JSON.stringify(cart));
        updateCartUI();
    };

    window.confirmCart = function () {
        window.location.href = "checkout.html";
    };

    updateCartUI();
});

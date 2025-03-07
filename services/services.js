var isLoggedIn = false;

document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.edit-btn');

   

    buttons.forEach(button => {
        button.addEventListener('click', function() {

            if(isLoggedIn == false){
                alert("You need to loggin first");
                return ;
            }
            
            if (button.textContent === 'Add To Cart') {
                button.textContent = 'Added to Cart';
                button.style.backgroundColor = 'blue';
            } else {
                button.textContent = 'Add to Cart';
                button.style.backgroundColor = '';
            }
        });
    });
});

let selectedServices = ["Service 1", "Service 2", "Service 3"]; // Sample data

let cart = [
    { name: "Service 1", price: 50 },
    { name: "Service 2", price: 30 },
];

function openCart() {
    displayCartItems();
    document.getElementById("cartPopup").style.display = "block";
    document.getElementById("cartOverlay").style.display = "block";
}

function closeCart() {
    document.getElementById("cartPopup").style.display = "none";
    document.getElementById("cartOverlay").style.display = "none";
}

function displayCartItems() {
    let cartList = document.getElementById("cartItems");
    let totalPrice = 0;
    cartList.innerHTML = "";

    cart.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.name} - $${item.price}`;
        cartList.appendChild(li);
        totalPrice += item.price;
    });

    document.getElementById("cartTotal").textContent = totalPrice.toFixed(2);
}

function openCheckout() {
    closeCart();
    document.getElementById("checkoutPopup").style.display = "block";
    document.getElementById("checkoutOverlay").style.display = "block";
}

function closeCheckout() {
    document.getElementById("checkoutPopup").style.display = "none";
    document.getElementById("checkoutOverlay").style.display = "none";
}

function confirmBooking() {
    let date = document.getElementById("service-date").value;
    let time = document.getElementById("service-time").value;

    if (!date) {
        alert("Please select a date!");
        return;
    }

    alert("Booking Confirmed for " + date + " at " + time);
    closeCheckout();
}

document.getElementById("cartBtn").addEventListener("click", openCart);

document.querySelectorAll(".edit-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
        const card = e.target.closest(".service-card");
        const name = card.querySelector("h3").innerText;
        const price = card.querySelector("p:nth-child(2)").innerText.replace("Price: ₹", "");
        const description = card.querySelector("p:nth-child(3)").innerText;

        document.getElementById("service-name").value = name;
        document.getElementById("service-price").value = price;
        document.getElementById("service-description").value = description;

        document.getElementById("edit-popup").classList.remove("hidden");
    });
});

document.getElementById("cancel-btn").addEventListener("click", () => {
    document.getElementById("edit-popup").classList.add("hidden");
});

document.querySelectorAll(".delete-btn").forEach((button) => {
    button.addEventListener("click", (e) => {
        const card = e.target.closest(".service-card");
        document.getElementById("confirm-popup").classList.remove("hidden");

        document.getElementById("confirm-delete-btn").onclick = () => {
            card.remove();
            document.getElementById("confirm-popup").classList.add("hidden");
        };

        document.getElementById("cancel-delete-btn").onclick = () => {
            document.getElementById("confirm-popup").classList.add("hidden");
        };
    });
});

// Save changes (example functionality)
document.getElementById('save-btn').addEventListener('click', () => {
    // Add your save logic here
    alert('Changes saved!');
    document.getElementById('edit-popup').classList.add('hidden');
});

// Add Service functionality
document.getElementById('add-service-btn').addEventListener('click', () => {
    document.getElementById('add-popup').classList.remove('hidden');
});

document.getElementById('add-cancel-btn').addEventListener('click', () => {
    document.getElementById('add-popup').classList.add('hidden');
});

document.getElementById('add-save-btn').addEventListener('click', () => {
    const name = document.getElementById('new-service-name').value;
    const price = document.getElementById('new-service-price').value;
    const description = document.getElementById('new-service-description').value;

    if (name && price && description) {
        const newCard = document.createElement('div');
        newCard.classList.add('service-card');
        newCard.innerHTML = `
            <h3>${name}</h3>
            <p>Price: ₹${price}</p>
            <p>${description}</p>
            <div class="actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        document.querySelector('.services-grid').appendChild(newCard);

        // Add event listeners to the new buttons
        newCard.querySelector('.edit-btn').addEventListener('click', (e) => {
            const card = e.target.closest('.service-card');
            const name = card.querySelector('h3').innerText;
            const price = card.querySelector('p:nth-child(2)').innerText.replace('Price: ₹', '');
            const description = card.querySelector('p:nth-child(3)').innerText;

            document.getElementById('service-name').value = name;
            document.getElementById('service-price').value = price;
            document.getElementById('service-description').value = description;

            document.getElementById('edit-popup').classList.remove('hidden');
        });

        newCard.querySelector('.delete-btn').addEventListener('click', (e) => {
            const card = e.target.closest('.service-card');
            document.getElementById('confirm-popup').classList.remove('hidden');

            document.getElementById('confirm-delete-btn').onclick = () => {
                card.remove();
                document.getElementById('confirm-popup').classList.add('hidden');
            };

            document.getElementById('cancel-delete-btn').onclick = () => {
                document.getElementById('confirm-popup').classList.add('hidden');
            };
        });

        document.getElementById('add-popup').classList.add('hidden');
    } else {
        alert('Please fill out all fields.');
    }
});

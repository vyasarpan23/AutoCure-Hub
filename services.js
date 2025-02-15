// services.js

// Sample services data
const services = [
    {
      name: "Oil Change",
      description: "Keep your engine running smoothly with our oil change service.",
      price: "$50"
    },
    {
      name: "Brake Repair",
      description: "Ensure your safety with our comprehensive brake repair services.",
      price: "$100"
    },
    {
      name: "Tire Services",
      description: "Get the best tire services including rotation, alignment, and replacement.",
      price: "$80"
    },
    {
      name: "Battery Replacement",
      description: "Ensure your car starts every time with our battery replacement service.",
      price: "$120"
    }
  ];
  
  // Function to render services
  function renderServices() {
    const servicesContainer = document.getElementById("servicesContainer");
    servicesContainer.innerHTML = ""; // Clear existing content
  
    services.forEach(service => {
      const serviceCard = document.createElement("div");
      serviceCard.className = "bg-white p-6 shadow-md rounded-xl service-card";
      serviceCard.innerHTML = `
        <h4 class="font-bold text-xl">${service.name}</h4>
        <p>${service.description}</p>
        <p class="mt-2 text-green-600 font-semibold">${service.price}</p>
        <button class="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">Book Now</button>
      `;
      servicesContainer.appendChild(serviceCard);
    });
  }
  
  // Function to add a new service
  function addNewService() {
    const newService = {
      name: "New Service",
      description: "This is a new service added dynamically.",
      price: "$150"
    };
    services.push(newService);
    renderServices(); // Re-render the services
  }
  
  // Event Listeners
  document.getElementById("addServiceBtn").addEventListener("click", addNewService);
  
  // Initial render
  renderServices();
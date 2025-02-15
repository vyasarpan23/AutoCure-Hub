// Customer Reviews Slider
function createReviewCard(name, rating, comment) {
    const card = document.createElement('div');
    card.className = 'review-card';
    card.innerHTML = `
      <img src="/api/placeholder/80/80" alt="${name}" class="customer-img">
      <h4 class="font-bold">${name}</h4>
      <div class="star-rating">
        ${Array(rating).fill('<i class="fas fa-star"></i>').join('')}
      </div>
      <p class="mt-2">"${comment}"</p>
    `;
    return card;
  }
  
  // Sample reviews data
  const reviews = [
    { name: 'Adarsh Patel', rating: 5, comment: 'Excellent service! Very professional team.' },
    { name: 'Arpan vyas', rating: 4, comment: 'Great experience, highly recommended!' },
    { name: 'Manasvi Ajmera', rating: 5, comment: 'Best auto service in town!' },
    { name: 'Anjali', rating: 5, comment: 'Excellent service! Very professional team.' },
    { name: 'Abhishek', rating: 4, comment: 'Great experience, highly recommended!' },
    { name: 'Atharv', rating: 5, comment: 'Best auto service in town!' }
  ];
  
  // Initialize reviews slider
  const slider = document.querySelector('.reviews-slider');
  if (slider) {
    reviews.forEach(review => {
      slider.appendChild(createReviewCard(review.name, review.rating, review.comment));
    });
  
    // Clone reviews for infinite scroll effect
    const reviewCards = document.querySelectorAll('.review-card');
    reviewCards.forEach(card => {
      slider.appendChild(card.cloneNode(true));
    });
  }
  
  // Modal Handling
  const modals = document.querySelectorAll('.modal');
  const closeBtns = document.querySelectorAll('.close');
  const loginBtn = document.getElementById('loginBtn');
  const signupBtn = document.getElementById('signupBtn');
  const contactBtn = document.getElementById('contactBtn');
  const contactBtn2 = document.getElementById('contactBtn2');
  const serviceBtn = document.getElementById('services-button');
  const reviewBtn = document.getElementById('reviewBtn');
  const bookServiceBtn = document.getElementById('bookServiceBtn');

  
  function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
  }
  
  function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
  }
  
  // Modal button event listeners
  loginBtn?.addEventListener('click', () => openModal('authModal'));
  signupBtn?.addEventListener('click', () => openModal('signupModal'));
  contactBtn?.addEventListener('click', () => openModal('contactModal'));
  contactBtn2?.addEventListener('click', () => openModal('contactModal'));
  serviceBtn?.addEventListener('click', () => openModal('servicesModal'));
  bookServiceBtn?.addEventListener('click', () => openModal('servicesModal'));
  reviewBtn?.addEventListener('click', () => openModal('ratingModal'));

  closeBtns.forEach(btn => {
    btn.onclick = function() {
      modals.forEach(modal => {
        modal.style.display = 'none';
      });
    }
  });
  
  // Tab System
  const tabButtons = document.querySelectorAll('.tab-button');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(button => {
    button.addEventListener('click', () => {
      tabButtons.forEach(btn => btn.classList.remove('active'));
      tabContents.forEach(content => content.classList.remove('active'));
  
      button.classList.add('active');
      const tabId = button.getAttribute('data-tab') + 'Form';
      document.getElementById(tabId)?.classList.add('active');
    });
  });
  
  // Close modal when clicking outside
  window.onclick = function(event) {
    modals.forEach(modal => {
      if (event.target === modal) {
        modal.style.display = 'none';
      }
    });
  }
  
  // Function to add new reviews dynamically
  function addNewReview(name, rating, comment) {
    if (slider) {
      const newReview = createReviewCard(name, rating, comment);
      slider.appendChild(newReview);
      slider.appendChild(newReview.cloneNode(true));
      
      // Reset animation
      slider.style.animation = 'none';
      slider.offsetHeight; // Trigger reflow
      slider.style.animation = null;
    }
  }
  
  // Form submission handlers
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (validateForm(form)) {
        alert('Form submitted successfully!');
        const modal = form.closest('.modal');
        if (modal) {
          modal.style.display = 'none';
        }
      }
    });
  });
  
  // Initialize Swiper
  const swiper = new Swiper('.swiper-container', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
  });
  
  // Smooth scroll for navigation links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });


  function initializeStarRating() {
    const starContainer = document.querySelector('#starRating');
    if (!starContainer) return;
  
    let currentRating = 0;
    const stars = starContainer.querySelectorAll('i');
  
    stars.forEach((star, index) => {
      star.addEventListener('mouseover', () => {
        for (let i = 0; i <= index; i++) {
          stars[i].classList.add('fas');
          stars[i].classList.remove('far');
        }
      });
  
      star.addEventListener('mouseout', () => {
        stars.forEach((s, i) => {
          if (i >= currentRating) {
            s.classList.remove('fas');
            s.classList.add('far');
          }
        });
      });
  
      star.addEventListener('click', () => {
        currentRating = index + 1;
        stars.forEach((s, i) => {
          if (i < currentRating) {
            s.classList.add('fas');
            s.classList.remove('far');
          } else {
            s.classList.remove('fas');
            s.classList.add('far');
          }
        });
      });
    });
  
    // Handle form submission
    const submitRatingButton = document.getElementById('submitRating');
    submitRatingButton.addEventListener('click', (e) => {
      e.preventDefault();
      const name = 'Anonymous'; // You can change this to get the user's name if available
      const comment = document.getElementById('ratingMessage').value;
  
      if (currentRating > 0 && comment) {
        addNewReview(name, currentRating, comment);
        alert('Review submitted successfully!');
        document.getElementById('ratingMessage').value = '';
        stars.forEach(star => {
          star.classList.remove('fas');
          star.classList.add('far');
        });
        currentRating = 0;
        document.getElementById('ratingModal').style.display = 'none';
      } else {
        alert('Please fill out all fields and select a rating.');
      }
    });
  }
  
  // Call initialization functions
  initializeStarRating();
  

  // Form validation
  function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], textarea[required]');
    let isValid = true;
  
    inputs.forEach(input => {
      if (!input.value.trim()) {
        isValid = false;
        input.classList.add('border-red-500');
      } else {
        input.classList.remove('border-red-500');
      }
    });
  
    return isValid;
  }
  
  // WhatsApp integration
  document.querySelector('.whatsapp-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const phoneNumber = '1234567890';
    const message = encodeURIComponent('Hi, I would like to know more about your services.');
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
  });
  
  // Loading state for buttons
  document.querySelectorAll('button[type="submit"]').forEach(button => {
    button.addEventListener('click', function() {
      if (validateForm(this.closest('form'))) {
        this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Submitting...';
        this.disabled = true;
        setTimeout(() => {
          this.innerHTML = 'Submitted';
          this.disabled = false;
        }, 2000);
      }
    });
  });
  
  // Initialize tooltips
  const tooltips = document.querySelectorAll('[data-tooltip]');
  tooltips.forEach(tooltip => {
    tooltip.addEventListener('mouseover', (e) => {
      const tip = document.createElement('div');
      tip.className = 'tooltip absolute bg-black text-white p-2 rounded text-sm';
      tip.textContent = e.target.dataset.tooltip;
      document.body.appendChild(tip);
      
      const rect = e.target.getBoundingClientRect();
      tip.style.top = `${rect.bottom + 5}px`;
      tip.style.left = `${rect.left}px`;
    });
  
    tooltip.addEventListener('mouseout', () => {
      document.querySelector('.tooltip')?.remove();
    });
  });
  
  // Initialize AOS (Animate on Scroll)
  AOS.init();
  
  // Initialize mobile menu
  const mobileMenuBtn = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');
  
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
  
  // Call initialization functions
  initializeStarRating();

  // Firebase configuration
  const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_AUTH_DOMAIN",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_STORAGE_BUCKET",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();
  
  // Franchise Contact Button and Modal Handling
  document.addEventListener('DOMContentLoaded', function() {
    const franchiseContactBtn = document.getElementById('franchiseContactBtn');
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.querySelector('#contactModal .close');
  
    franchiseContactBtn.addEventListener("click", function() {
      contactModal.style.display = "block";
    });
  
    closeModal.addEventListener('click', function() {
      contactModal.style.display = 'none';
    });
  
    window.addEventListener('click', function(event) {
      if (event.target == contactModal) {
        contactModal.style.display = 'none';
      }
    });
  });  
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.edit-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            button.textContent = 'Added to Cart';
            button.style.backgroundColor = 'blue';
        });
    });
});
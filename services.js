document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.edit-btn');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
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

document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;

            if (!username || !email || !password) {
                alert('Please fill in all fields');
                return;
            }
            
            if (password.length < 10) {
                alert('Password must be at least 10 characters');
                return;
            }
            
            if (!validateEmail(email)) {
                alert('Please enter a valid email address');
                return;
            }
            const user = {
                username,
                email,
                password,
                newsletter: document.querySelector('input[name="newsletter"]').checked,
                savedRecipes: [],
                groceryList: []
            };
            
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert('Registration successful! Welcome to Thyme\'s Up!');
            registerForm.reset();
            updateUIForLoggedInUser();
        });
    }

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    const filterBtn = document.getElementById('filter-btn');
    const filterBox = document.getElementById('filter-box');
    
    if (filterBtn && filterBox) {
        filterBtn.addEventListener('click', function() {
            filterBox.classList.toggle('hidden');
        });
        
        document.getElementById('done-btn').addEventListener('click', function() {
            filterBox.classList.add('hidden');
            applyFilters();
        });

        document.getElementById('clear-btn').addEventListener('click', function() {
            const inputs = filterBox.querySelectorAll('input, select');
            inputs.forEach(input => {
                if (input.type === 'checkbox' || input.type === 'radio') {
                    input.checked = false;
                } else if (input.tagName === 'SELECT') {
                    input.selectedIndex = 0;
                }
            });
        });
    }

    function applyFilters() {
        console.log('Applying filters...');
    }

    const recipeCards = document.querySelectorAll('.recipe-card');

    recipeCards.forEach(card => {
        card.querySelector('.recipe-front').addEventListener('click', function(e) {
            if (!e.target.classList.contains('btn') && !e.target.closest('.recipe-actions')) {
                card.classList.add('flipped');
            }
        });
        
        card.querySelector('.recipe-back').addEventListener('click', function(e) {
            if (e.target === this || e.target.tagName === 'H3') {
                card.classList.remove('flipped');
            }
        });

        const saveBtn = card.querySelector('.save-btn');
        if (saveBtn) {
            saveBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                saveRecipe(card);
            });
        }
        
        const shareBtn = card.querySelector('.share-btn');
        if (shareBtn) {
            shareBtn.addEventListener('click', function(e) {
                e.stopPropagation();
                shareRecipe(card);
            });
        }
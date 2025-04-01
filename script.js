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
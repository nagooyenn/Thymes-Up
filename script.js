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

        card.querySelectorAll('.back-ingredients li').forEach(ingredient => {
            const textSpan = ingredient.querySelector('.ingredient-text');
            const checkBtn = ingredient.querySelector('.check-btn');
            const xBtn = ingredient.querySelector('.x-btn');
            const subBtn = ingredient.querySelector('.sub-btn');
            
            if (checkBtn) {
                checkBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    textSpan.style.textDecoration = 'line-through';
                    textSpan.style.color = '#888';
                    this.style.opacity = '0.7';
                });
            }
            q
            if (xBtn) {
                xBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    addToGroceryList(textSpan.textContent);
                    this.textContent = '✓';
                    this.style.background = '#4CAF50';
                });
            }
            
            if (subBtn) {
                subBtn.addEventListener('click', function(e) {
                    e.stopPropagation();
                    showSubstitutions(textSpan);
                });
            }
        });
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

    function saveRecipe(card) {
        if (!isLoggedIn()) {
            alert('Please register or log in to save recipes');
            return;
        }
        
        const recipeName = card.querySelector('h3').textContent;
        const user = JSON.parse(localStorage.getItem('currentUser'));
        
        if (!user.savedRecipes.includes(recipeName)) {
            user.savedRecipes.push(recipeName);
            localStorage.setItem('currentUser', JSON.stringify(user));
            alert(`${recipeName} saved to your collection!`);
        } else {
            alert('This recipe is already saved!');
        }
    }

    function shareRecipe(card) {
        const recipeName = card.querySelector('h3').textContent;
        const shareData = {
            title: recipeName,
            text: `Check out this recipe from Thyme's Up: ${recipeName}`,
            url: window.location.href
        };
        
        if (navigator.share) {
            navigator.share(shareData)
                .catch(err => console.log('Error sharing:', err));
        } else {
            copyToClipboard(shareData.url);
            alert('Link copied to clipboard!');
        }
    }

    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }
    
    const substitutions = {
        "milk": ["almond milk", "soy milk", "oat milk", "coconut milk"],
        "butter": ["margarine", "coconut oil", "lard", "vegetable oil"],
        "flour": ["almond flour", "coconut flour", "oat flour"],
        "sugar": ["honey", "maple syrup", "stevia", "monk fruit sweetener"],
        "cream": ["coconut cream", "evaporated milk", "yogurt", "silken tofu"],
        "cheese": ["nutritional yeast", "tofu", "cashew cheese"],
        "chicken": ["tofu", "tempeh", "jackfruit", "mushrooms"],
        "garlic": ["garlic powder ", "shallots", "chives"],
        "onion": ["onion powder", "shallots", "leeks", "chives"],
        "parsley": ["cilantro", "basil", "chervil"],
        "salt": ["soy sauce", "miso paste", "seaweed"],
    };

    function showSubstitutions(textSpan) {
        const ingredientText = textSpan.textContent;
        const ingredient = findMainIngredient(ingredientText);
        const subs = getSubstitutions(ingredient);
        
        if (subs.length > 0) {
            const subText = subs.join('\n• ');
            if (confirm(`Substitutions for ${ingredient}:\n• ${subText}\n\nApply first substitution?`)) {
                const newText = ingredientText.replace(
                    new RegExp(ingredient, 'i'), 
                    subs[0]
                );
                textSpan.textContent = newText;
            }
        } else {
            alert(`No substitutions found for ${ingredient}`);
        }
    }

    function getSubstitutions(ingredient) {
        ingredient = ingredient.toLowerCase();
        for (const [key, subs] of Object.entries(substitutions)) {
            if (ingredient.includes(key)) {
                return subs;
            }
        }
        return [];
    }
    
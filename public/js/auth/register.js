// Fun facts array
const funFacts = [
    "💡 Fun Fact: Honey never spoils.",
    "🌟 Fun Fact: Octopuses have three hearts.",
    "🚀 Fun Fact: A day on Venus is longer than its year.",
    "🧠 Fun Fact: Your brain uses 20% of your body's energy.",
    "🌍 Fun Fact: There are more possible chess games than atoms in the observable universe.",
    "🐧 Fun Fact: Penguins can jump up to 6 feet out of water.",
    "🌙 Fun Fact: The Moon is moving away from Earth at about 1.5 inches per year.",
    "🦋 Fun Fact: Butterflies taste with their feet.",
    "🌊 Fun Fact: The ocean contains 99% of Earth's living space.",
    "⚡ Fun Fact: Lightning is 5 times hotter than the surface of the sun.",
    "🎵 Fun Fact: Music can make food taste better.",
    "🐘 Fun Fact: Elephants are afraid of bees.",
    "🌈 Fun Fact: Rainbow colors appear in the same order every time.",
    "🍌 Fun Fact: Bananas are berries, but strawberries aren't.",
    "🧊 Fun Fact: Hot water can freeze faster than cold water.",
    "🦒 Fun Fact: Giraffes have the same number of neck bones as humans.",
    "🌺 Fun Fact: Some flowers can bloom for over 100 years.",
    "🎯 Fun Fact: The human eye can distinguish about 10 million colors.",
    "🌸 Fun Fact: Cherry blossoms are actually edible.",
    "🐙 Fun Fact: Squids have three hearts and blue blood."
];

// Display random fun fact on page load
function displayRandomFunFact() {
    const randomIndex = Math.floor(Math.random() * funFacts.length);
    document.getElementById('funFact').innerHTML = `<p>${funFacts[randomIndex]}</p>`;
}

// Initialize fun fact
displayRandomFunFact();

// Handle form submission properly
document.getElementById('signupForm').addEventListener('submit', function(e) {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Basic validation
    if (!email || !username || !password) {
        e.preventDefault();
        alert('Please fill in all fields');
        return;
    }
    
    if (username.length < 5) {
        e.preventDefault();
        alert('Username must be at least 5 characters long');
        return;
    }
    
    if (password.length < 6) {
        e.preventDefault();
        alert('Password must be at least 6 characters long');
        return;
    }
    
    // Show loading state
    const submitBtn = document.getElementById('emailBtn');
    submitBtn.textContent = 'Signing Up...';
    submitBtn.disabled = true;
    
    // Let the form submit naturally (don't prevent default)
    // The form will submit to /auth/register with POST method
});

// Add subtle parallax effect to background
document.addEventListener('mousemove', function(e) {
    const container = document.querySelector('.signup-container');
    const x = (e.clientX / window.innerWidth) * 100;
    const y = (e.clientY / window.innerHeight) * 100;
    
    container.style.transform = `translate(${x/50}px, ${y/50}px)`;
});
// Navigation function for auth buttons
function navigateToPage(page) {
    console.log('🔍 Navigating to:', page);
    
    switch(page) {
        case 'signin':
            console.log('➡️ Redirecting to login page');
            window.location.href = '/auth/login';
            break;
        case 'signup':
            console.log('➡️ Redirecting to register page');
            window.location.href = '/auth/register';
            break;
        case 'guest':
            console.log('➡️ Redirecting to home page');
            window.location.href = '/';
            break;
        default:
            console.log('❌ Invalid page:', page);
            break;
    }
}

// Page load handler
document.addEventListener('DOMContentLoaded', function() {
    console.log('✅ Auth index page loaded');
    console.log('✅ Navigation functions ready');
    
    // Add click animations to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Button clicked:', this.textContent);
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 100);
        });
    });
});

// Debug function
function testNavigation() {
    console.log('Testing navigation functions...');
    console.log('navigateToPage function exists:', typeof navigateToPage === 'function');
}

// Call test on load
testNavigation();
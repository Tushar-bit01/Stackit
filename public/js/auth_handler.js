// Pure JavaScript - no EJS syntax
window.isUserAuthenticated = serverData.isAuthenticated;
window.currentUser = serverData.user;

// Additional auth functions if needed
function checkAuthStatus() {
    return window.isUserAuthenticated;
}

function getCurrentUser() {
    return window.currentUser;
}
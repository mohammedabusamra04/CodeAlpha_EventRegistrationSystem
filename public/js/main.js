// Global helpers, auth state, and shared utilities

function getAuthToken() {
    return localStorage.getItem('token');
}

function getAuthUser() {
    const token = getAuthToken();
    if (!token) return null;
    return {
        name: localStorage.getItem('userName'),
        role: localStorage.getItem('userRole')
    };
}

function isLoggedIn() {
    return !!getAuthToken();
}

function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('userRole');
    showToast('You have been signed out successfully.', 'success');
    setTimeout(() => {
        window.location.href = '/';
    }, 1000);
}

function escapeHtml(str) {
    if (str === null || str === undefined) return '';
    const div = document.createElement('div');
    div.textContent = String(str);
    return div.innerHTML;
}

function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.className = `toast show ${type}`;
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    setTimeout(() => {
        toast.className = 'toast';
        toast.removeAttribute('role');
    }, 3500);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const options = {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function formatPrice(price) {
    const num = parseFloat(price);
    return num === 0 ? 'Free' : `$${num.toFixed(0)}`;
}

function updateNavbar() {
    const authLinksContainer = document.getElementById('nav-auth-links');
    if (!authLinksContainer) return;

    const user = getAuthUser();
    if (user) {
        let linksHtml = `<a href="/dashboard">Dashboard</a>`;
        if (user.role === 'organizer' || user.role === 'admin') {
            linksHtml += `<a href="/admin">Organizer Panel</a>`;
        }
        linksHtml += `
            <span class="nav-user-name" title="${escapeHtml(user.name)}">${escapeHtml(user.name)}</span>
            <button onclick="handleLogout()" class="btn btn-secondary btn-sm" aria-label="Sign out">Sign Out</button>
        `;
        authLinksContainer.innerHTML = linksHtml;
    } else {
        authLinksContainer.innerHTML = `
            <a href="/login" class="btn btn-secondary btn-sm">Sign In</a>
            <a href="/register" class="btn btn-primary btn-sm">Create Account</a>
        `;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    updateNavbar();
});

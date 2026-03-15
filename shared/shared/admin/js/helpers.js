window.showToast = function(message, type = 'success') {
    const toast = document.getElementById('toast');
    if (!toast) return alert(message);
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2000);
};

window.showModal = function(modalId, content) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    const contentDiv = modal.querySelector('.modal-content');
    if (contentDiv) contentDiv.innerHTML = content;
    modal.style.display = 'flex';
};

window.closeModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
};

console.log('✅ helpers.js loaded');
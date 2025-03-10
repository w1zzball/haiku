function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function setupCSRFAjax() {
    const csrftoken = getCookie('csrftoken');

    const originalFetch = window.fetch;
    window.fetch = function (url, options = {}) {
        options.credentials = 'same-origin';
        options.headers = {
            ...options.headers,
            'X-CSRFToken': csrftoken,
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
        };
        return originalFetch(url, options);
    };
}

document.addEventListener('DOMContentLoaded', setupCSRFAjax);

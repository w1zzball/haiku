document.addEventListener('DOMContentLoaded', function () {
    // Function to get CSRF token
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

    const csrftoken = getCookie('csrftoken');

    // Event delegation for like buttons
    document.body.addEventListener('click', function (e) {
        if (e.target.closest('.like-button')) {
            const button = e.target.closest('.like-button');
            const postId = button.dataset.postId;
            const isLiked = button.classList.contains('liked');
            const action = isLiked ? 'unlike' : 'like';

            // Optimistic UI update
            const likeCount = document.querySelector(`.like-count[data-post-id="${postId}"]`);
            const currentCount = parseInt(likeCount.textContent);

            if (isLiked) {
                button.classList.remove('liked');
                button.innerHTML = '<i class="far fa-heart"></i>';
                button.setAttribute('aria-label', 'Like this post');
                likeCount.textContent = Math.max(0, currentCount - 1);
            } else {
                button.classList.add('liked');
                button.innerHTML = '<i class="fas fa-heart"></i>';
                button.setAttribute('aria-label', 'Unlike this post');
                likeCount.textContent = currentCount + 1;
            }

            // Send request to server
            fetch(`/posts/${postId}/${action}/`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrftoken,
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    if (!data.success) {
                        // Revert optimistic update if there was an error
                        if (isLiked) {
                            button.classList.add('liked');
                            button.innerHTML = '<i class="fas fa-heart"></i>';
                            button.setAttribute('aria-label', 'Unlike this post');
                        } else {
                            button.classList.remove('liked');
                            button.innerHTML = '<i class="far fa-heart"></i>';
                            button.setAttribute('aria-label', 'Like this post');
                        }
                        likeCount.textContent = currentCount;
                        console.error('Failed to update like status');
                    }
                })
                .catch(error => {
                    // Revert optimistic update on network error
                    if (isLiked) {
                        button.classList.add('liked');
                        button.innerHTML = '<i class="fas fa-heart"></i>';
                    } else {
                        button.classList.remove('liked');
                        button.innerHTML = '<i class="far fa-heart"></i>';
                    }
                    likeCount.textContent = currentCount;
                    console.error('Error:', error);
                });
        }
    });
});
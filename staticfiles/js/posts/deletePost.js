document.addEventListener('DOMContentLoaded', function () {
    const csrftoken = getCookie('csrftoken')

    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('delete-post-btn')) {
            const postId = e.target.dataset.postId
            const postItem = document.querySelector(`li.post-item[data-post-id="${postId}"]`)

            if (confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
                fetch(`/posts/delete/${postId}/`, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        'X-CSRFToken': csrftoken
                    }
                })
                    .then((response) => response.json())
                    .then((data) => {
                        if (data.success) {
                            // Show success message
                            showToast('Post deleted successfully!', 'success');
                            postItem.classList.add('fade-out')
                            setTimeout(() => {
                                postItem.remove()
                            }, 500)
                        }
                    })
            }
        }
    })
})

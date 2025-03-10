document.addEventListener('DOMContentLoaded', function () {
    const csrftoken = getCookie('csrftoken')

    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-post-btn')) {
            const postId = e.target.dataset.postId
            const postItem = document.querySelector(`li.post-item[data-post-id="${postId}"]`)
            const postContent = postItem.querySelector('.post-content')
            const originalContent = postContent.innerHTML

            fetch(`/user/edit/${postId}/`, {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrftoken
                }
            })
                .then((response) => response.json())
                .then((data) => {
                    if (!data.form) {
                        console.error('No form data received');
                        return;
                    }

                    postContent.innerHTML = data.form

                    const editForm = postContent.querySelector('.edit-post-form')
                    const cancelBtn = editForm.querySelector('.cancel-edit-btn')

                    cancelBtn.addEventListener('click', function () {
                        postContent.innerHTML = originalContent
                    })

                    editForm.addEventListener('submit', function (e) {
                        e.preventDefault()

                        const formData = new FormData(editForm)
                        fetch(`/user/edit/${postId}/`, {
                            method: 'POST',
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest',
                                'X-CSRFToken': csrftoken
                            },
                            body: formData
                        })
                            .then((response) => response.json())
                            .then((data) => {
                                if (data.success && data.body) {
                                    postContent.innerHTML = originalContent
                                    const bodyElement = postItem.querySelector('.post-body')
                                    if (bodyElement) {
                                        bodyElement.textContent = data.body
                                    }
                                } else {
                                    console.error('Update failed or no body content received');
                                }
                            })
                            .catch((error) => {
                                console.error('Error updating post:', error)
                                postContent.innerHTML = originalContent
                            })
                    })
                })
                .catch((error) => {
                    console.error('Error fetching edit form:', error)
                })
        }
    })
})

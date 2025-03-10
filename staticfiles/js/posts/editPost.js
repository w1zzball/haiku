document.addEventListener('DOMContentLoaded', function () {
    const csrftoken = getCookie('csrftoken')

    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-post-btn')) {
            const postId = e.target.dataset.postId
            const postItem = document.querySelector(`li.post-item[data-post-id="${postId}"]`)
            const postContent = postItem.querySelector('.post-content')
            const originalContent = postContent.innerHTML

            fetch(`/user/edit/${postId}/`, {
                method: 'GET',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                }
            })
                .then(response => response.json())
                .then((data) => {
                    if (!data.form) {
                        console.error('No form data received')
                        return
                    }

                    postContent.innerHTML = data.form

                    const editForm = postContent.querySelector('.edit-post-form')
                    const cancelBtn = editForm.querySelector('.cancel-edit-btn')

                    cancelBtn.addEventListener('click', function () {
                        postContent.innerHTML = originalContent
                    })

                    // Handle form submission
                    editForm.addEventListener('submit', function (e) {
                        e.preventDefault()
                        const formData = new FormData(editForm)

                        // Add CSRF token manually if not present
                        if (!formData.get('csrfmiddlewaretoken')) {
                            const csrfInput = document.createElement('input')
                            csrfInput.type = 'hidden'
                            csrfInput.name = 'csrfmiddlewaretoken'
                            csrfInput.value = csrftoken
                            editForm.appendChild(csrfInput)
                            formData.append('csrfmiddlewaretoken', csrftoken)
                        }

                        fetch(`/user/edit/${postId}/`, {
                            method: 'POST',
                            headers: {
                                'X-Requested-With': 'XMLHttpRequest'
                            },
                            body: formData
                        })
                            .then(response => response.json())
                            .then((data) => {
                                if (data.success && data.body) {
                                    postContent.innerHTML = originalContent
                                    const bodyElement = postItem.querySelector('.post-body')
                                    if (bodyElement) {
                                        bodyElement.textContent = data.body
                                    }
                                } else if (data.errors) {
                                    const errorMessages = Object.values(data.errors).flat()
                                    alert('Error: ' + errorMessages.join('\n'))
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

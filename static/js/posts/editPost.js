document.addEventListener('DOMContentLoaded', function () {
    let activeEditForm = null;
    let activePostContent = null;
    let activeOriginalContent = null;

    document.body.addEventListener('click', function (e) {
        if (e.target.classList.contains('edit-post-btn')) {
            const postId = e.target.dataset.postId
            // selector works with both list and detail views
            const postItem = document.querySelector(`li.post-item[data-post-id="${postId}"], .post-item.single-view[data-post-id="${postId}"]`)
            const postContent = postItem.querySelector('.post-content')
            const originalContent = postContent.innerHTML

            // Close any existing edit form first
            if (activeEditForm && activePostContent) {
                activePostContent.innerHTML = activeOriginalContent;
            }

            fetch(`/posts/edit/${postId}/`, {
                method: 'GET'
            })
                .then(response => response.json())
                .then((data) => {
                    if (!data.form) {
                        console.error('No form data received')
                        return
                    }

                    postContent.innerHTML = data.form

                    // Store active edit form references
                    activeEditForm = postContent.querySelector('.post-form')
                    activePostContent = postContent
                    activeOriginalContent = originalContent

                    const editForm = postContent.querySelector('.post-form')
                    const cancelBtn = editForm.querySelector('#cancel-post')

                    cancelBtn.addEventListener('click', function () {
                        postContent.innerHTML = originalContent
                    })

                    // Handle form submission
                    editForm.addEventListener('submit', function (e) {
                        e.preventDefault()
                        const formData = new FormData(editForm)

                        fetch(`/posts/edit/${postId}/`, {
                            method: 'POST',
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

                    // Initialize counter after form is loaded
                    initializeSyllableCounter()
                })
                .catch((error) => {
                    console.error('Error fetching edit form:', error)
                })
        }
    })

    // Handle clicks outside edit form
    document.addEventListener('click', function (e) {
        if (activeEditForm && activePostContent && !activeEditForm.contains(e.target) && !e.target.classList.contains('edit-post-btn')) {
            activePostContent.innerHTML = activeOriginalContent
            activeEditForm = null
            activePostContent = null
            activeOriginalContent = null
            // Reinitialize clickable text
            const clickableTexts = document.querySelectorAll('.selectable-clickable');
            clickableTexts.forEach(function (element) {
                element.addEventListener('click', function (e) {
                    // Check if text is being selected
                    const selection = window.getSelection();
                    if (selection.toString().length === 0) {
                        // No text is selected, navigate to the URL
                        const url = this.dataset.href;
                        if (url) {
                            window.location.href = url;
                        }
                    }
                });
            });
        }
    })
})

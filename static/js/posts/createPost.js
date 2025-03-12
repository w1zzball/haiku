document.addEventListener('DOMContentLoaded', function () {
    const newPostButton = document.getElementById('new-post-button')
    const overlay = document.getElementById('post-form-overlay')
    const formContainer = document.getElementById('post-form-container')
    const csrftoken = getCookie('csrftoken')

    // Check if elements exist
    if (!newPostButton || !overlay || !formContainer) return;

    newPostButton.addEventListener('click', function (e) {
        e.preventDefault()

        fetch('/posts/create/', {
            method: 'GET'
        })
            .then((response) => response.json())
            .then((data) => {
                formContainer.innerHTML = data.form
                overlay.style.display = 'flex'

                const postForm = formContainer.querySelector('.post-form')
                postForm.addEventListener('submit', function (e) {
                    e.preventDefault()

                    // Use the CSRF token that's already in the form
                    const formData = new FormData(postForm)

                    fetch('/posts/create/', {
                        method: 'POST',
                        body: formData
                    })
                        .then((response) => response.json())
                        .then((data) => {
                            if (data.success) {
                                // Close the overlay
                                overlay.style.display = 'none'

                                // Add the new post to the DOM if on a page with posts
                                const postList = document.querySelector('.post-list')
                                if (postList) {
                                    // Create new post element
                                    const newPost = createPostElement(data)

                                    // Insert at the beginning of the list (newest first)
                                    if (postList.firstChild) {
                                        postList.insertBefore(newPost, postList.firstChild)
                                    } else {
                                        postList.appendChild(newPost)
                                    }

                                    // If there was a "no posts" message, remove it
                                    const noPostsMessage = postList.querySelector('li:not(.post-item)')
                                    if (noPostsMessage) {
                                        noPostsMessage.remove()
                                    }

                                    // Highlight the new post briefly
                                    newPost.classList.add('new-post-highlight')
                                    setTimeout(() => {
                                        newPost.classList.remove('new-post-highlight')
                                    }, 2000)
                                }
                            } else if (data.errors) {
                                // Display validation errors
                                const errorMessages = Object.values(data.errors).flat()
                                alert('Error: ' + errorMessages.join('\n'))
                            }
                        })
                        .catch((error) => {
                            console.error('Error creating post:', error)
                        })
                })

                // Cancel button behavior
                document.getElementById('cancel-post').addEventListener('click', function () {
                    overlay.style.display = 'none'
                })
            })
            .catch((error) => {
                console.error('Error loading form:', error)
            })
    })

    // Close overlay when clicking outside the form
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.style.display = 'none'
        }
    })

    // Helper function to create a post element
    function createPostElement(data) {
        const li = document.createElement('li')
        li.className = 'post-item'
        li.dataset.postId = data.post_id

        const postContent = document.createElement('div')
        postContent.className = 'post-content'

        const postBody = document.createElement('p')
        postBody.className = 'post-body'
        postBody.textContent = data.body

        const postMeta = document.createElement('p')
        postMeta.className = 'post-meta'

        // Format current date in a friendly way
        const now = new Date()
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        const dateFormatted = now.toLocaleDateString('en-US', options)

        const postActionsHtml = `
          <span class="post-actions">
            <button class="btn btn-sm edit-post-btn" data-post-id="${data.post_id}">Edit</button>
            <button class="btn btn-sm btn-danger delete-post-btn" data-post-id="${data.post_id}">Delete</button>
          </span>
        `

        postMeta.innerHTML = `<small>Posted on ${dateFormatted}</small> ${postActionsHtml}`

        postContent.appendChild(postBody)
        postContent.appendChild(postMeta)
        li.appendChild(postContent)

        return li
    }
})
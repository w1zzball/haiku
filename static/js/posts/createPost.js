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

                // Initialize syllable counter
                initializeSyllableCounter();

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

        // Create selectable and clickable post body
        const postBody = document.createElement('p')
        postBody.className = 'post-body selectable-clickable'
        postBody.dataset.href = `/posts/${data.post_id}/`
        postBody.textContent = data.body

        const postMeta = document.createElement('div')
        postMeta.className = 'post-meta'

        // Format current date in a friendly way
        const now = new Date()
        const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' }
        const timeOptions = { hour: 'numeric', minute: 'numeric', hour12: true }
        const dateFormatted = now.toLocaleDateString('en-US', dateOptions)
        const timeFormatted = now.toLocaleTimeString('en-US', timeOptions)

        postMeta.innerHTML = `<small>Posted on ${dateFormatted} at ${timeFormatted}</small>`

        // Create post footer
        const postFooter = document.createElement('div')
        postFooter.className = 'post-footer'

        // Add likes section
        const postLikes = document.createElement('div')
        postLikes.className = 'post-likes'
        postLikes.innerHTML = `
            <button class="like-button" data-post-id="${data.post_id}" aria-label="Like this post">
                <i class="far fa-heart"></i>
            </button>
            <span class="like-count" data-post-id="${data.post_id}">0</span>
            <span class="like-label">likes</span>
        `

        // Add post actions (edit/delete buttons)
        const postActions = document.createElement('span')
        postActions.className = 'post-actions'
        postActions.innerHTML = `
            <button class="non-floating-button edit-post-btn" data-post-id="${data.post_id}">
                <i class="fa-solid fa-pen"></i>
            </button>
            <button class="non-floating-button delete-post-btn" data-post-id="${data.post_id}">
                <i class="fa-solid fa-xmark"></i>
            </button>
        `

        // Add both elements to the footer
        postFooter.appendChild(postLikes)
        postFooter.appendChild(postActions)

        // Assemble the post
        postContent.appendChild(postBody)
        postContent.appendChild(postMeta)
        postContent.appendChild(postFooter)
        li.appendChild(postContent)

        return li
    }
})
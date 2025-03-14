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
        const li = document.createElement('li');
        li.className = 'post-item';
        li.dataset.postId = data.post_id;

        // Create main post content container
        const postContent = document.createElement('div');
        postContent.className = 'post-content';

        // Create post link with proper styling
        const postLink = document.createElement('a');
        postLink.href = `/posts/${data.post_id}/`; // Adjust URL pattern as needed
        postLink.className = 'post-link';
        postLink.style.textDecoration = 'none'; // Force inline style as a backup

        // Create post body inside link
        const postBody = document.createElement('p');
        postBody.className = 'post-body';
        postBody.textContent = data.body;

        // Assemble post structure
        postLink.appendChild(postBody);
        postContent.appendChild(postLink);

        // Create footer elements
        const postFooter = document.createElement('div');
        postFooter.className = 'post-footer';

        // Create likes section
        const postLikes = document.createElement('div');
        postLikes.className = 'post-likes';

        // Add like button
        const likeButton = document.createElement('button');
        likeButton.className = 'like-button';
        likeButton.dataset.postId = data.post_id;
        likeButton.setAttribute('aria-label', 'Like this post');

        const likeIcon = document.createElement('i');
        likeIcon.className = 'far fa-heart';
        likeButton.appendChild(likeIcon);

        // Add like count and label
        const likeCount = document.createElement('span');
        likeCount.className = 'like-count';
        likeCount.dataset.postId = data.post_id;
        likeCount.textContent = '0';

        const likeLabel = document.createElement('span');
        likeLabel.className = 'like-label';
        likeLabel.textContent = 'likes';

        // Add elements to likes section
        postLikes.appendChild(likeButton);
        postLikes.appendChild(likeCount);
        postLikes.appendChild(likeLabel);

        // Add edit/delete buttons 

        const postActions = document.createElement('span');
        postActions.className = 'post-actions';

        // Edit button
        const editButton = document.createElement('button');
        editButton.className = 'non-floating-button edit-post-btn';
        editButton.dataset.postId = data.post_id;

        const editIcon = document.createElement('i');
        editIcon.className = 'fa-solid fa-pen';
        editButton.appendChild(editIcon);

        // Delete button
        const deleteButton = document.createElement('button');
        deleteButton.className = 'non-floating-button delete-post-btn';
        deleteButton.dataset.postId = data.post_id;

        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-solid fa-xmark';
        deleteButton.appendChild(deleteIcon);

        // Add buttons to actions
        postActions.appendChild(editButton);
        postActions.appendChild(deleteButton);

        // Add actions to footer
        postFooter.appendChild(postLikes);
        postFooter.appendChild(postActions);

        // Add footer to post
        postContent.appendChild(postFooter);

        // Add post content to list item
        li.appendChild(postContent);

        return li;
    }
})
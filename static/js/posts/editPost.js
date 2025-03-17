document.addEventListener('DOMContentLoaded', function () {
    // State tracking variables
    let activeEditState = {
        form: null,
        postContent: null,
        originalHTML: null,
        postId: null,
        isEdited: false
    };

    // Event delegation for edit buttons
    document.body.addEventListener('click', function (e) {
        // Handle edit button clicks
        if (e.target.closest('.edit-post-btn')) {
            const button = e.target.closest('.edit-post-btn');
            const postId = button.dataset.postId;
            handleEditButtonClick(postId);
        }

        // Handle clicks outside the active edit form
        else if (activeEditState.form && !e.target.closest('.post-form')) {
            handleOutsideClick();
        }
    });

    function handleEditButtonClick(postId) {
        // Cancel any active edit first
        if (activeEditState.form) {
            cancelEdit();
        }

        // Find the post item
        const postItem = document.querySelector(`.post-item[data-post-id="${postId}"], .single-view[data-post-id="${postId}"]`);
        if (!postItem) return;

        const postContent = postItem.querySelector('.post-content');
        if (!postContent) return;

        // Save original state
        activeEditState = {
            form: null,
            postContent: postContent,
            originalHTML: postContent.innerHTML,
            postId: postId,
            isEdited: false
        };

        // Fetch the edit form
        fetch(`/posts/edit/${postId}/`, {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest'
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (!data.form) {
                    throw new Error('No form data received');
                }

                // Insert the form
                postContent.innerHTML = data.form;

                // Update our state
                activeEditState.form = postContent.querySelector('.post-form');

                // Set up event handlers
                setupFormEventHandlers();

                // Initialize any additional components
                if (typeof initializeSyllableCounter === 'function') {
                    initializeSyllableCounter();
                }
            })
            .catch(error => {
                console.error('Error fetching edit form:', error);
                cancelEdit();
            });
    }

    function setupFormEventHandlers() {
        if (!activeEditState.form) return;

        // Cancel button handler
        const cancelBtn = activeEditState.form.querySelector('#cancel-post');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', function (e) {
                e.preventDefault();
                cancelEdit();
            });
        }

        // Form submission handler
        activeEditState.form.addEventListener('submit', function (e) {
            e.preventDefault();

            const formData = new FormData(activeEditState.form);
            const postId = activeEditState.postId;

            fetch(`/posts/edit/${postId}/`, {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': getCsrfToken()
                },
                body: formData
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success && data.body) {
                        // Mark as successfully edited
                        activeEditState.isEdited = true;

                        // Check if this is a detail view or list view
                        const isSingleView = activeEditState.postContent.closest('.single-view') !== null;

                        // Handle differently based on view type
                        if (isSingleView) {
                            // For single post view (detail page), restore original structure first
                            activeEditState.postContent.innerHTML = activeEditState.originalHTML;

                            // Find the post body within the correct structure
                            const postBody = activeEditState.postContent.querySelector('.post-body');
                            if (postBody) {
                                // Just update the text content of the existing body
                                postBody.textContent = data.body;
                            }
                        } else {
                            // For list view, restore original structure
                            activeEditState.postContent.innerHTML = activeEditState.originalHTML;

                            // Update post body and ensure link exists
                            const postBody = activeEditState.postContent.querySelector('.post-body');
                            if (postBody) {
                                // Update the text
                                postBody.textContent = data.body;

                                // If post body is not inside a link, wrap it
                                if (!postBody.closest('a.post-link')) {
                                    // Create a link
                                    const postLink = document.createElement('a');
                                    postLink.href = `/posts/${activeEditState.postId}/`;
                                    postLink.className = 'post-link';

                                    // Get the post body's parent
                                    const parent = postBody.parentNode;

                                    // Replace the post body with the link containing it
                                    const postBodyClone = postBody.cloneNode(true);
                                    parent.removeChild(postBody);
                                    postLink.appendChild(postBodyClone);

                                    // Add link at beginning of content
                                    if (parent.firstChild) {
                                        parent.insertBefore(postLink, parent.firstChild);
                                    } else {
                                        parent.appendChild(postLink);
                                    }
                                }
                            }
                        }

                        // Reset edit state
                        activeEditState = {
                            form: null,
                            postContent: null,
                            originalHTML: null,
                            postId: null,
                            isEdited: false
                        };
                    }
                    else if (data.errors) {
                        const errorMessages = Object.values(data.errors).flat();
                        alert('Error: ' + errorMessages.join('\n'));
                    }
                })
                .catch(error => {
                    console.error('Error updating post:', error);
                    cancelEdit();
                });
        });
    }

    function cancelEdit() {
        if (activeEditState.postContent) {
            activeEditState.postContent.innerHTML = activeEditState.originalHTML;
        }

        // Reset state
        activeEditState = {
            form: null,
            postContent: null,
            originalHTML: null,
            postId: null,
            isEdited: false
        };
    }

    function handleOutsideClick() {
        // Don't cancel if we've successfully edited (handled by the edit success flow)
        if (!activeEditState.isEdited) {
            cancelEdit();
        }
    }

    function getCsrfToken() {
        return document.querySelector('[name=csrfmiddlewaretoken]')?.value || '';
    }
});

function setupProfileEditing() {
    // Get CSRF token
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

    // Bio editing
    const bioEditBtn = document.getElementById('edit-bio-btn');
    const bioOverlay = document.getElementById('bio-edit-overlay');
    const bioForm = document.getElementById('bio-form');
    const bioContent = document.getElementById('bio-content');
    const cancelBioBtn = document.getElementById('cancel-bio-edit');

    bioEditBtn.addEventListener('click', function () {
        bioOverlay.style.display = 'flex';
    });

    cancelBioBtn.addEventListener('click', function () {
        bioOverlay.style.display = 'none';
    });

    bioForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(bioForm);

        fetch('/user/update/bio/', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrftoken
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    bioContent.textContent = data.bio || 'No bio yet.';
                    bioOverlay.style.display = 'none';
                }
            });
    });

    // Profile picture editing
    const picEditBtn = document.getElementById('change-pic-btn');
    const picOverlay = document.getElementById('pic-edit-overlay');
    const picForm = document.getElementById('pic-form');
    const cancelPicBtn = document.getElementById('cancel-pic-edit');

    picEditBtn.addEventListener('click', function () {
        picOverlay.style.display = 'flex';
    });

    cancelPicBtn.addEventListener('click', function () {
        picOverlay.style.display = 'none';
    });

    picForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formData = new FormData(picForm);

        fetch('/user/update/pic/', {
            method: 'POST',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrftoken
            },
            body: formData
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    // Update the profile picture
                    const profilePic = document.querySelector('.profile-pic img');
                    if (profilePic) {
                        profilePic.src = data.profile_pic_url;
                    } else {
                        // Create new image if there was no profile pic before
                        const defaultPic = document.querySelector('.default-profile-pic');
                        if (defaultPic) {
                            defaultPic.parentNode.innerHTML = `<img src="${data.profile_pic_url}" alt="Profile picture">`;
                        }
                    }
                    picOverlay.style.display = 'none';
                }
            });
    });

    // Close overlays when clicking outside
    [bioOverlay, picOverlay].forEach(overlay => {
        overlay.addEventListener('click', function (e) {
            if (e.target === overlay) {
                overlay.style.display = 'none';
            }
        });
    });
}

// Profile deletion functionality
const csrftoken = getCookie('csrftoken');

const deleteProfileBtn = document.getElementById('delete-profile-btn');
const deleteProfileOverlay = document.getElementById('delete-profile-overlay');
const cancelDeleteProfileBtn = document.getElementById('cancel-delete-profile');

if (deleteProfileBtn && deleteProfileOverlay && cancelDeleteProfileBtn) {
    deleteProfileBtn.addEventListener('click', function () {
        deleteProfileOverlay.style.display = 'flex';
    });

    cancelDeleteProfileBtn.addEventListener('click', function () {
        deleteProfileOverlay.style.display = 'none';
    });

    // Close delete overlay when clicking outside
    deleteProfileOverlay.addEventListener('click', function (e) {
        if (e.target === deleteProfileOverlay) {
            deleteProfileOverlay.style.display = 'none';
        }
    });

    // Handle form submission with confirmation
    const deleteProfileForm = document.getElementById('delete-profile-form');
    deleteProfileForm.addEventListener('submit', function (e) {
        e.preventDefault();

        // Second confirmation
        if (confirm("This will permanently delete your account. Are you absolutely sure?")) {
            const formData = new FormData(deleteProfileForm);

            fetch('/user/delete-profile/', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRFToken': csrftoken
                },
                body: formData
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        // Redirect to home page or show success message
                        window.location.href = data.redirect_url || '/';
                    } else {
                        alert(data.error || 'There was an error deleting your profile.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('There was an error processing your request.');
                });
        }
    });
}

// Make sure to call setupProfileEditing when the DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    setupProfileEditing();
});
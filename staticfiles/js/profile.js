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
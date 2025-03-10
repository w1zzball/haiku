document.addEventListener('DOMContentLoaded', function () {
    const newPostButton = document.getElementById('new-post-button')
    const overlay = document.getElementById('post-form-overlay')
    const formContainer = document.getElementById('post-form-container')
    const csrftoken = getCookie('csrftoken')

    newPostButton.addEventListener('click', function (e) {
        e.preventDefault()

        fetch('/user/create/', {
            method: 'GET',
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRFToken': csrftoken
            }
        })
            .then((response) => response.json())
            .then((data) => {
                formContainer.innerHTML = data.form
                overlay.style.display = 'flex'

                const postForm = document.getElementById('post-form')
                postForm.addEventListener('submit', function (e) {
                    e.preventDefault()

                    fetch('/user/create/', {
                        method: 'POST',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRFToken': csrftoken
                        },
                        body: new FormData(this)
                    }).then((response) => {
                        if (response.ok) {
                            window.location.reload()
                        }
                    })
                })

                document.getElementById('cancel-post').addEventListener('click', function () {
                    overlay.style.display = 'none'
                })
            })
    })

    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.style.display = 'none'
        }
    })
})

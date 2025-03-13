document.addEventListener('DOMContentLoaded', function () {
    // Find all selectable-clickable elements
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
});
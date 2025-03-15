document.addEventListener("DOMContentLoaded", function() {
    const progressBar = document.getElementById("progress-bar");
    let progress = 0;
    function updateProgress() {
        progress += 10;
        if (progress > 100) progress = 0;
        progressBar.style.width = progress + "%";
    }
    setInterval(updateProgress, 1000);
});
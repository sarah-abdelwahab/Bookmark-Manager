document.getElementById('bookmarkForm').addEventListener('submit', saveBookmark);
document.getElementById('siteName').addEventListener('input', validateSiteName);
document.getElementById('siteURL').addEventListener('input', validateSiteURL);

function saveBookmark(e) {
    e.preventDefault();

    // Get form values
    const siteName = document.getElementById('siteName').value;
    const siteURL = document.getElementById('siteURL').value;

    // Validation
    if (!validateForm(siteName, siteURL)) {
        return false;
    }

    const bookmark = {
        name: siteName,
        url: siteURL
    };

    // Save to localStorage
    if (localStorage.getItem('bookmarks') === null) {
        const bookmarks = [];
        bookmarks.push(bookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    } else {
        const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
        bookmarks.push(bookmark);
        localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
    }

    // Clear form
    document.getElementById('bookmarkForm').reset();
    resetBorders();

    // Fetch bookmarks again
    fetchBookmarks();
}

function deleteBookmark(url) {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));

    for (let i = 0; i < bookmarks.length; i++) {
        if (bookmarks[i].url === url) {
            bookmarks.splice(i, 1);
        }
    }

    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));

    // Fetch bookmarks again
    fetchBookmarks();
}

function fetchBookmarks() {
    const bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
    const bookmarksTable = document.querySelector('#bookmarksTable tbody');

    bookmarksTable.innerHTML = '';

    for (let i = 0; i < bookmarks.length; i++) {
        const name = bookmarks[i].name;
        const url = bookmarks[i].url;

        bookmarksTable.innerHTML += `
            <tr>
                <td>${i + 1}</td>
                <td>${name}</td>
                <td><a class="btn btn-visit" target="_blank" href="http://${url}"><i class="fa-solid fa-eye p-2"></i>Visit</a></td>
                <td><button class="btn btn-delete" onclick="deleteBookmark('${url}')"><i class="fa-solid fa-trash-can p-2"></i>Delete</button></td>
            </tr>
        `;
    }
}

function validateForm(siteName, siteURL) {
    const modal = document.getElementById('errorModal');
    const errorMessages = document.getElementById('modalErrorMessages');
    errorMessages.innerHTML = '';

    const nameRegex = /^[a-zA-Z0-9\s]{3,}$/;
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9]+(\.[a-zA-Z]{2,})+)$/;

    let isValid = true;

    if (!nameRegex.test(siteName)) {
        errorMessages.innerHTML += '<p>Site Name must be at least 3 characters long and contain only alphanumeric characters and spaces.</p>';
        isValid = false;
    }

    if (!urlRegex.test(siteURL)) {
        errorMessages.innerHTML += '<p>Please use a valid URL (e.g., example.com).</p>';
        isValid = false;
    }

    if (!isValid) {
        modal.style.display = 'block';
    }

    return isValid;
}

function validateSiteName() {
    const siteName = document.getElementById('siteName').value;
    const nameRegex = /^[a-zA-Z0-9\s]{3,}$/;

    if (nameRegex.test(siteName)) {
        document.getElementById('siteName').style.borderColor = 'green';
    } else {
        document.getElementById('siteName').style.borderColor = 'red';
    }
}

function validateSiteURL() {
    const siteURL = document.getElementById('siteURL').value;
    const urlRegex = /^(https?:\/\/)?([a-zA-Z0-9]+(\.[a-zA-Z]{2,})+)$/;

    if (urlRegex.test(siteURL)) {
        document.getElementById('siteURL').style.borderColor = 'green';
    } else {
        document.getElementById('siteURL').style.borderColor = 'red';
    }
}

function resetBorders() {
    document.getElementById('siteName').style.borderColor = '';
    document.getElementById('siteURL').style.borderColor = '';
}

// Close the modal
const modal = document.getElementById('errorModal');
const closeBtn = document.getElementsByClassName('close')[0];

closeBtn.onclick = function() {
    modal.style.display = 'none';
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Fetch bookmarks on page load
document.addEventListener('DOMContentLoaded', fetchBookmarks);

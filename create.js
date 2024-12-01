function addPost() {
    const category = document.getElementById('category').value;
    const title = document.getElementById('postTitle').value;
    const body = document.getElementById('body').value;
    const thumbnail = document.getElementById('thumb').files[0];
    const userName = document.getElementById('userName').value;
    const profileImgSrc = document.querySelector('.nav-profile img').src;
    const currentDate = new Date().toLocaleString();

    const reader = new FileReader();
    reader.onload = function (e) {
        const post = {
            category,
            title,
            body,
            thumbnail: e.target.result,
            userName,
            profileImgSrc,
            date: currentDate
        };

        const posts = JSON.parse(localStorage.getItem('posts')) || [];
        posts.push(post);
        localStorage.setItem('posts', JSON.stringify(posts));

        window.location.href = 'home.html';
    };

    if (thumbnail) {
        reader.readAsDataURL(thumbnail);
    }
}

function displayPosts() {
    const posts = JSON.parse(localStorage.getItem('posts')) || [];
    const homePosts = document.getElementById('homePosts');

    homePosts.innerHTML = '';

    if (posts.length === 0 && window.location.pathname.includes('my-posts.html')) {
        const noPostsMessage = document.createElement('p');
        noPostsMessage.textContent = "No posts yet";
        noPostsMessage.id = "noPostsMessage";
        homePosts.appendChild(noPostsMessage);
        return;
    }

    posts.reverse().forEach((post, displayIndex) => {
        const postContent = document.createElement('article');
        postContent.classList.add('post1');
        postContent.innerHTML = `
            <div class="thumbnail">
                <img src="${post.thumbnail}" alt="">
            </div>
            <div class="post-info">
                <a href="category.html" class="category">${post.category}</a>
                <h3 class="post-title">${post.title}</h3>
                <p class="post-body">${post.body}</p>
                <div class="post-profile">
                    <div class="post-profile-img">
                        <img src="${post.profileImgSrc}">
                    </div>
                    <div class="post-profile-info">
                        <h5>${post.userName}</h5>
                        <small>${post.date}</small>
                    </div>
                </div>
            </div>

            <div class="comment-section">
                <button class="like" id="likeBtn"><i class="fa-regular fa-heart"></i></button>
                <div id="likeCountDisplay">0</div>
                <button class="like" id="replyBtn"><i class="fa-regular fa-comment"></i></button>
                <div id="commentCountDisplay">0</div>
                <button class="like" id="shareBtn"><i class="fa-solid fa-share"></i></button>
            </div>

            <div class="modal-overlay" id="modalOverlay">
                <div class="popup-container">
                    <div id="commentsList" class="comments-list"></div>
                    <div class="form-wrapper">
                        <form class="comment" id="newCommentForm">
                            <input type="text" placeholder="Comment" class="comment-input" id="commentTextarea"></input>
                            <button class="submit" type="submit"><i class="fa-regular fa-paper-plane"></i></button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        if (window.location.pathname.includes('my-posts.html')) {
            const originalIndex = posts.length - 1 - displayIndex;
            postContent.innerHTML += `<button class="delete-post" onclick="deletePost(${originalIndex})">Delete Post</button>`;
        }

        homePosts.appendChild(postContent);

        initializePostEvents(postContent);
    });
}


function initializePostEvents(postElement) {
    let commentCount = 0;
    let likeCount = 0;

    const likeBtn = postElement.querySelector('#likeBtn');
    if (likeBtn) {
        likeBtn.addEventListener('click', function () {
            const likeIcon = this.querySelector('i');
            if (likeIcon.classList.contains('fa-solid')) {
                likeIcon.classList.remove('fa-solid');
                likeIcon.classList.add('fa-regular');
                likeIcon.style.color = '';
                likeCount--;
            } else {
                likeIcon.classList.remove('fa-regular');
                likeIcon.classList.add('fa-solid');
                likeIcon.style.color = 'red';
                likeCount++;
            }
            updateLikeCount(postElement);
        });
    }

    const replyBtn = postElement.querySelector('#replyBtn');
    if (replyBtn) {
        replyBtn.addEventListener('click', function () {
            const modalOverlay = postElement.querySelector('#modalOverlay');
            modalOverlay.style.display = modalOverlay.style.display === 'flex' ? 'none' : 'flex';
        });
    }

    const newCommentForm = postElement.querySelector('#newCommentForm');
    newCommentForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const commentTextarea = postElement.querySelector('#commentTextarea');
        const commentText = commentTextarea.value.trim();

        if (commentText) {
            const commentsList = postElement.querySelector('#commentsList');
            const newComment = document.createElement('div');
            newComment.classList.add('comment-item');

            const profileImgSrc = document.querySelector('.nav-profile img').src;
            const profilePic = document.createElement('img');
            profilePic.classList.add('profile-pic');
            profilePic.src = profileImgSrc;
            profilePic.alt = 'Profile Picture';

            const commentTextSpan = document.createElement('span');
            commentTextSpan.classList.add('comment-text');
            commentTextSpan.textContent = commentText;
            commentTextSpan.style.color = 'black';

            const optionsIcon = document.createElement('i');
            optionsIcon.classList.add('fa-solid', 'fa-ellipsis-vertical', 'options-icon');
            optionsIcon.style.color = 'black';

            const dropdown = document.createElement('div');
            dropdown.classList.add('options-dropdown');

            const shareBtn = document.createElement('button');
            shareBtn.textContent = 'Share';
            shareBtn.addEventListener('click', function () {
                alert("Share this comment!");
            });

            const deleteBtn = document.createElement('button');
            deleteBtn.textContent = 'Delete';
            deleteBtn.addEventListener('click', function () {
                commentsList.removeChild(newComment);
                commentCount--;
                updateCommentCount(postElement);
            });

            dropdown.appendChild(shareBtn);
            dropdown.appendChild(deleteBtn);

            optionsIcon.appendChild(dropdown);
            optionsIcon.addEventListener('click', function () {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            });

            newComment.appendChild(profilePic);
            newComment.appendChild(commentTextSpan);
            newComment.appendChild(optionsIcon);
            commentsList.prepend(newComment);

            commentTextarea.value = '';
            commentCount++;
            updateCommentCount(postElement);
        }
    });

    function updateCommentCount(postElement) {
        const commentCountDisplay = postElement.querySelector('#commentCountDisplay');
        commentCountDisplay.textContent = `${commentCount}`;
    }

    function updateLikeCount(postElement) {
        const likeCountDisplay = postElement.querySelector('#likeCountDisplay');
        likeCountDisplay.textContent = `${likeCount}`;
    }

    // Close modal overlay when clicking outside
    const modalOverlay = postElement.querySelector('.modal-overlay');
    window.onclick = function (event) {
        if (modalOverlay.style.display === 'flex' && event.target === modalOverlay) {
            modalOverlay.style.display = 'none';
        }
    };
}

function deletePost(index) {
    let posts = JSON.parse(localStorage.getItem('posts')) || [];
    posts.splice(index, 1);
    localStorage.setItem('posts', JSON.stringify(posts));
    displayPosts();
}

window.onload = displayPosts;

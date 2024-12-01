document.addEventListener('DOMContentLoaded', function() {
    function initializePostEvents(postElement) {
        let commentCount = 0; 
        let likeCount = 0; 

        const likeBtn = postElement.querySelector('#likeBtn');
        if (likeBtn) {
            likeBtn.addEventListener('click', function() {
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
            replyBtn.addEventListener('click', function() {
                const modalOverlay = postElement.querySelector('#modalOverlay');
                modalOverlay.style.display = modalOverlay.style.display === 'flex' ? 'none' : 'flex'; 
            });
        }

        const newCommentForm = postElement.querySelector('#newCommentForm');
        newCommentForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            const commentTextarea = postElement.querySelector('#commentTextarea');
            const commentText = commentTextarea.value.trim(); 
            
            if (commentText) {
                const commentsList = postElement.querySelector('#commentsList');
                const newComment = document.createElement('div');
                newComment.classList.add('comment-item');

                const profileImgSrc = document.querySelector('.nav-profile #profile-img').getAttribute('src');

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
                shareBtn.addEventListener('click', function() {
                    alert("Share this comment!");
                });

                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Delete';
                deleteBtn.addEventListener('click', function() {
                    commentsList.removeChild(newComment);
                    commentCount--; 
                    updateCommentCount(postElement); 
                });

                dropdown.appendChild(shareBtn);
                dropdown.appendChild(deleteBtn);

                optionsIcon.appendChild(dropdown);
                optionsIcon.addEventListener('click', function() {
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
    }

    const post = document.querySelector('.single-post'); 
    initializePostEvents(post);

    window.onclick = function(event) {
        const modalOverlay = post.querySelector('#modalOverlay');
        if (event.target === modalOverlay) {
            modalOverlay.style.display = "none";
        }
    };
});

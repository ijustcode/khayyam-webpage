let currentUser = null;

// Auth state listener
auth.onAuthStateChanged(user => {
    currentUser = user;
    const loginBtn = document.getElementById('loginBtn');
    const userInfo = document.getElementById('user-info');
    const commentForm = document.getElementById('comment-form');

    if (user) {
        loginBtn.style.display = 'none';
        userInfo.style.display = 'flex';
        commentForm.style.display = 'block';
        document.getElementById('user-name').textContent = user.displayName;
        document.getElementById('user-avatar').src = user.photoURL || '';
    } else {
        loginBtn.style.display = 'inline-block';
        userInfo.style.display = 'none';
        commentForm.style.display = 'none';
    }
});

function signIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch(err => {
        console.error('Sign-in error:', err);
        alert('Sign-in failed. Please try again.');
    });
}

function signOut() {
    auth.signOut();
}

// Comments
function getPoemId() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id') || '0';
}

function loadComments() {
    const poemId = getPoemId();
    db.collection('poems').doc(poemId).collection('comments')
        .orderBy('timestamp', 'desc')
        .onSnapshot(snapshot => {
            const list = document.getElementById('comments-list');
            if (snapshot.empty) {
                list.innerHTML = '<p class="no-comments">هنوز نظری ثبت نشده است / No comments yet</p>';
                return;
            }
            list.innerHTML = '';
            snapshot.forEach(doc => {
                const c = doc.data();
                const date = c.timestamp ? c.timestamp.toDate().toLocaleDateString('en-US', {
                    year: 'numeric', month: 'short', day: 'numeric'
                }) : '';
                const div = document.createElement('div');
                div.className = 'comment-item';
                div.innerHTML = `
                    <div class="comment-header">
                        <img src="${c.photoURL || ''}" alt="">
                        <span class="comment-author">${c.displayName || 'Anonymous'}</span>
                        <span class="comment-date">${date}</span>
                    </div>
                    <div class="comment-body">${escapeHTML(c.text)}</div>
                `;
                list.appendChild(div);
            });
        }, err => {
            console.error('Error loading comments:', err);
            document.getElementById('comments-list').innerHTML =
                '<p class="no-comments">Error loading comments</p>';
        });
}

function submitComment() {
    if (!currentUser) return;
    const textarea = document.getElementById('comment-text');
    const text = textarea.value.trim();
    if (!text) return;

    const poemId = getPoemId();
    db.collection('poems').doc(poemId).collection('comments').add({
        text: text,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        uid: currentUser.uid,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
        textarea.value = '';
    }).catch(err => {
        console.error('Error posting comment:', err);
        alert('Failed to post comment.');
    });
}

function escapeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Start loading comments
loadComments();

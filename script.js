const SHEET_ID = '1CECqWRkDhGjk23VkmHxwWguTTMt9j_r37n3fFzUbOag'; // Replace with your Google Sheet ID
const FORM_ID = 'forumForm';
const POSTS_CONTAINER_ID = 'forumPosts';

document.getElementById(FORM_ID).addEventListener('submit', async (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const formDataObject = Object.fromEntries(formData.entries());

  try {
    await submitPost(formDataObject);
    event.target.reset();
  } catch (error) {
    console.error('Error submitting post:', error);
  }
});

async function submitPost(data) {
  const response = await fetch(`https://script.google.com/macros/s/${SHEET_ID}/exec`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to submit post');
  }
  fetchPosts();
}

async function fetchPosts() {
  const response = await fetch(`https://script.google.com/macros/s/${SHEET_ID}/exec?action=read`);
  if (response.ok) {
    const posts = await response.json();
    renderPosts(posts);
  } else {
    console.error('Failed to fetch posts');
  }
}

function renderPosts(posts) {
  const postsContainer = document.getElementById(POSTS_CONTAINER_ID);
  postsContainer.innerHTML = '';

  posts.forEach(post => {
    const postElement = document.createElement('div');
    postElement.classList.add('post');
    postElement.innerHTML = `
      <div class="post-username">${post.username}</div>
      <div class="post-message">${post.message}</div>
      <div class="post-date">${post.date}</div>
    `;
    postsContainer.appendChild(postElement);
  });
}

fetchPosts();

const BASE_URL = "http://localhost:3000/posts";

function main() {
  displayPosts();
  addNewPostListener();
}

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';
      posts.forEach(post => {
        const div = document.createElement('div');
        div.textContent = post.title;
        div.dataset.id = post.id;
        div.addEventListener('click', () => handlePostClick(post.id));
        postList.appendChild(div);
      });
    });
}

function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      const detail = document.getElementById('post-detail');
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
        <p><em>by ${post.author}</em></p>
        <button id="delete-post">Delete</button>
        <button id="edit-post">Edit</button>
      `;

      // Optional: Edit and delete
      document.getElementById('delete-post').onclick = () => deletePost(id);
      document.getElementById('edit-post').onclick = () => showEditForm(post);
    });
}

function addNewPostListener() {
  const form = document.getElementById('new-post-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const newPost = {
      title: form.title.value,
      content: form.content.value,
      author: form.author.value
    };

    fetch(BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(post => {
        displayPosts();
        form.reset();
      });
  });
}

function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, { method: 'DELETE' })
    .then(() => {
      displayPosts();
      document.getElementById('post-detail').innerHTML = '';
    });
}

function showEditForm(post) {
  const form = document.getElementById('edit-post-form');
  form.classList.remove('hidden');
  form.title.value = post.title;
  form.content.value = post.content;

  form.onsubmit = function(e) {
    e.preventDefault();
    const updatedPost = {
      title: form.title.value,
      content: form.content.value
    };
    fetch(`${BASE_URL}/${post.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedPost)
    })
      .then(res => res.json())
      .then(updated => {
        displayPosts();
        handlePostClick(post.id);
        form.classList.add('hidden');
      });
  };

  document.getElementById('cancel-edit').onclick = () => {
    form.classList.add('hidden');
  };
}

document.addEventListener("DOMContentLoaded", main);

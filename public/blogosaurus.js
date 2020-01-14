function checkUser(user) {
  if (user) {
    document.querySelector('#new-post').style.display = 'block';
    document.querySelector('#signin').style.display = 'none';

    let nameField = document.querySelector('#name');
    nameField.value = user.displayName;
    nameField.disabled = true;
  } else {
    document.querySelector('#new-post').style.display = 'none';
    document.querySelector('#signin').style.display = 'block';
  }
}

function signIn() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

function signOut() {
  firebase.auth().signOut();
}

function loadPosts() {
  let db = firebase.firestore();
  db.collection("posts").orderBy("created", "desc").get().then(renderPosts);
}

function renderPosts(posts) {
  posts.forEach(renderPost);
}

function renderPost(post) {
  let postData = post.data();
  let postName = postData.name;
  let postTitle = postData.title;
  let postContent = postData.content;

  let postTemplate = document.querySelector('#post');
  let postElement = document.importNode(postTemplate.content, true)

  postElement.querySelector('.name').textContent = postName;
  postElement.querySelector('.title').textContent = postTitle;
  postElement.querySelector('.content').textContent = postContent;

  document.querySelector('main').appendChild(postElement);
}

function savePost(e) {
  e.preventDefault();

  let db = firebase.firestore();

  let post = {
    'name': document.querySelector('#name').value,
    'title': document.querySelector('#title').value,
    'content': document.querySelector('#content').value,
    'created': firebase.firestore.Timestamp.now()
  }

  db.collection("posts").add(post).then(saveSuccess).catch(saveError);
}

function saveSuccess(post) {
  window.location.assign('/blog.html');
}

function saveError(error) {
  // Handle error.
}

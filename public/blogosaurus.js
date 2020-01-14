
// Handles user state.
function checkUser(user) {

  // If the user is logged in, show the new post form.
  if (user) {
    document.querySelector('#new-post').style.display = 'block';
    document.querySelector('#signin').style.display = 'none';

    // Add the user's name to the form.
    let nameField = document.querySelector('#name');
    nameField.value = user.displayName;
    nameField.disabled = true;

  // If the user is not logged in, hide the form.
  } else {
    document.querySelector('#new-post').style.display = 'none';
    document.querySelector('#signin').style.display = 'block';
  }
}

// Pop up the authentication form when the user signs in.
function signIn() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}

// Handle user sign out.
function signOut() {
  firebase.auth().signOut();
}

// Load posts from the database.
function loadPosts() {
  let db = firebase.firestore();

  let query = db.collection("posts");  // Query for posts.
  query = query.orderBy("created", "desc");  // Order by time.
  query.get().then(renderPosts);  // Get posts and pass to the render function.
}

// Render each post.
function renderPosts(posts) {
  posts.forEach(renderPost);
}

// Render one post.
function renderPost(post) {
  // Get the post data.
  let postData = post.data();
  let postName = postData.name;
  let postTitle = postData.title;
  let postContent = postData.content;

  // Clone the post template.
  let postTemplate = document.querySelector('#post');
  let postElement = document.importNode(postTemplate.content, true)

  // Add post data to the post template.
  postElement.querySelector('.name').textContent = postName;
  postElement.querySelector('.title').textContent = postTitle;
  postElement.querySelector('.content').textContent = postContent;

  // Add the post to the document.
  document.querySelector('main').appendChild(postElement);
}

// Save a post to the database.
function savePost(e) {
  // Don't reload the page when submitting.
  e.preventDefault();

  let db = firebase.firestore();

  // Add the form data to a post object.
  let post = {
    'name': document.querySelector('#name').value,
    'title': document.querySelector('#title').value,
    'content': document.querySelector('#content').value,
    'created': firebase.firestore.Timestamp.now()
  }

  // Add the post object to the database.
  db.collection("posts").add(post).then(saveSuccess).catch(saveError);
}

// Handle save successes.
function saveSuccess(post) {
  window.location.assign('/blog.html');
}

// Handle save errors.
function saveError(error) {
  console.log(error);
}

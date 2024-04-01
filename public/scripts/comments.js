const loadCommentsBtnElement = document.getElementById('load-comments-btn');
const commentsSectionElement = document.getElementById('comments');
const commentsFormElement = document.querySelector('#comments-form form');
const commentTitleElement = document.getElementById('title');
const commentTextElement = document.getElementById('text');

function createCommentsList(comments) {
  const commentListElement = document.createElement('ol');

  for (const comment of comments) {
    const commentElement = document.createElement('li');
    commentElement.innerHTML = `
      <article class="comment-item">
        <h2>${comment.title}</h2>
        <p>${comment.text}</p>
      </article>
    `;
    commentListElement.appendChild(commentElement);
  }

  return commentListElement;
}

async function fetchCommentsForPost() {
  const postId = loadCommentsBtnElement.dataset.postid;
  try{
    const response = await fetch(`/posts/${postId}/comments`);
  if (!response.ok) {
    alert('Could not fetch comments.');
    return;
  }
  const responseData = await response.json();

  if (responseData && responseData.length > 0) {
    const commentsListElement = createCommentsList(responseData);
    commentsSectionElement.innerHTML = '';
    commentsSectionElement.appendChild(commentsListElement);
  } else {
    commentsSectionElement.firstElementChild.textContent = 'No comments yet.';
  }
  } catch (error) {
    alert('Could not fetch comments. Please check your connection.');
  }
}

async function saveComment(event) {
  event.preventDefault();
  const enteredTitle = commentTitleElement.value;
  const enteredText = commentTextElement.value;
  const postId = commentsFormElement.dataset.postid;
  const comment = { title: enteredTitle, text: enteredText };

  try {
    const response = await fetch(`/posts/${postId}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(comment),
    });

    if (response.ok) {
      fetchCommentsForPost();
    } else {
      alert('Could not save comment.');
    }
  } catch (error) {
    alert('Could not sent comment. Please check your connection.');
  }
}

loadCommentsBtnElement.addEventListener('click', fetchCommentsForPost);
commentsFormElement.addEventListener('submit', saveComment);

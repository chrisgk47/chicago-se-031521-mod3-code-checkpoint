// write your code here
const likeSection = document.querySelector('div.likes-section')

const likeSpan = document.querySelector('span.likes')
const likeBttn = document.querySelector('button.like-button')

const commUl = document.querySelector('ul.comments')
const commForm = document.querySelector('form.comment-form')

//core deliverables
fetch('http://localhost:3000/images/1')
.then(res => res.json())
.then(postObj => loadDetail(postObj))


function loadDetail(postObj){
    const h2 = document.querySelector('h2.title')
    const img = document.querySelector('img.image')

    h2.innerText = postObj.title
    img.src = postObj.image
    img.dataset.id = postObj.id

    likeSpan.textContent = `${postObj.likes} Likes`
    
    commForm.dataset.id = postObj.id

    commUl.innerHTML = ''

    dislike()

    fetch('http://localhost:3000/comments')
        .then(res => res.json())
        .then(comArr => {
            comArr.forEach(comObj => showComments(comObj))
        })
}
function showComments(comObj){
    const newLi = document.createElement('li')
    newLi.textContent = comObj.content
    newLi.dataset.id = comObj.id

    commUl.append(newLi)
}

likeBttn.addEventListener('click', evt => {
    
    let numLike = parseInt(likeSpan.textContent)

    fetch('http://localhost:3000/images/1', {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({likes: numLike + 1})
    })
        .then(res => res.json())
        .then(postObj => {
            likeSpan.textContent = `${postObj.likes} Likes`
        })
})
// advanced deliverables
function dislike(){
    let dislikeBtn = document.createElement('button')
    dislikeBtn.classList.add('down-vote')
    dislikeBtn.innerText = '💔'
    likeSection.append(dislikeBtn)

    dislikeBtn.addEventListener('click', event => {
        
        let numLike = parseInt(likeSpan.textContent)
     
        fetch('http://localhost:3000/images/1', {
        method: 'PATCH',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify({likes: numLike - 1})
    })
        .then(res => res.json())
        .then(postObj => {
            likeSpan.textContent = `${postObj.likes} Likes`
        })

    })
}

commForm.addEventListener('submit', ev => {
    ev.preventDefault()
    
    let newCom = {
        id: '',
        imageId: ev.target.dataset.id,
        content: ev.target.comment.value
    }

    fetch('http://localhost:3000/comments', {
        method: 'POST',
        headers: {
            'content-type': 'application/json',
            'accept': 'application/json'
        },
        body: JSON.stringify(newCom)
    })
    .then(res => res.json())
    .then(comObj => {
        showComments(comObj)

        commForm.reset()
    })
}) 

commUl.addEventListener('click', e => {
    if(e.target.matches('li')){

        fetch(`http://localhost:3000/comments/${e.target.dataset.id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(e.target.remove())
    }
})





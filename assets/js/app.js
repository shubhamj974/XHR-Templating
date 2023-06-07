let cl = console.log;

const postContainer = document.getElementById('postContainer');
const formContainer = document.getElementById('formContainer');
const titleControl = document.getElementById('title');
const contentControl = document.getElementById('content');
const createBtn = document.getElementById('createBtn');
const updateBtn = document.getElementById('updateBtn');
const cancelBtn = document.getElementById('cancelBtn');
const fadeModel = document.getElementById('fade-model');
const fadeOverley = document.getElementById('fadeOverley');
const hideFade = document.querySelectorAll('.hideFade');
const deleteBtn = document.getElementById('deleteBtn');

let baseUrl = `https://jsonplaceholder.typicode.com/`;
let postUrl = `${baseUrl}posts`;
let postUrl01 = `${baseUrl}post`;

// let postUrl = Math.random() >= 4 ? postUrl01 : baseUrl



function createApiCall(method, apiUrl, body) {
    let xhr = new XMLHttpRequest();
    xhr.open(method, apiUrl);
    xhr.onload = function () {
        if (xhr.status === 200 || xhr.status === 201) {
            if (method === 'GET') {
                postArr = JSON.parse(xhr.response)
                if (Array.isArray(postArr)) {
                    postTemp(postArr)
                } else {
                    titleControl.value = postArr.title,
                    contentControl.value = postArr.body
                }
            } else if (method === "POST") {
                cl(body)
                let obj = {
                    ...JSON.parse(body),
                    ...JSON.parse(xhr.response)
                }
                postArr.push(obj);
                postTemp(postArr)
            } else if (method === 'PATCH') {
                let cardId = JSON.parse(xhr.response).id;
                const card = document.getElementById(cardId).children;
                card[0].innerHTML = `<h3>${JSON.parse(body).title}</h3>`;
                card[1].innerHTML = `<p>${JSON.parse(body).body}</p>`
            }else if(method === "DELETE"){
                // cl(xhr.response)
                let deleteID = localStorage.getItem('deleteItem');
                localStorage.clear();
                localStorage.removeItem('deleteID');
                document.getElementById(deleteID).remove()
            }
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!',
                timer: 2000
            })
        }
    }
    xhr.send(body)
}
createApiCall('GET', Math.random() >= .4 ? `${postUrl}` : `${postUrl01}`)

function postTemp(arr) {
    let result = '';
    arr.forEach(ele => {
        postContainer.innerHTML = result +=
            `
            <div class="card my-4" id="${ele.id}">
                <div class="card-header">
                    <h3>${ele.title}</h3>
                </div>
                <div class="card-body">
                    <p>${ele.body}</p>
                </div>
                <div class="card-footer space-between">
                <button class="btn btn-danger" type="button" onclick = "OneditHandler(this)"><i class="fa-solid fa-pen-to-square"></i></button>
                <button class="btn btn-primary" type="button" onclick = "OndeletePopUpShow(this)"><i class="fa-solid fa-trash"></i></button>
                </div>
            </div>
             
        `
    });
}


const onSubmitHandler = (e) => {
    e.preventDefault();
    cl('submitted')
    let postObj = {
        title: titleControl.value,
        body: contentControl.value,
        userId: Math.ceil(Math.random() * 10)
    }
    createApiCall('POST', postUrl, JSON.stringify(postObj))
    e.target.reset();

}

const OneditHandler = (e) => {
    let editId = e.closest('.card').id;
    localStorage.setItem('editId', editId);
    let editUrl = `${baseUrl}posts/${editId}`;
    updateBtn.classList.remove('d-none');
    cancelBtn.classList.remove('d-none');
    createBtn.classList.add('d-none');
    createApiCall('GET', editUrl)
}

const onCancelHandler = (e) => {
    formContainer.reset();
    updateBtn.classList.add('d-none');
    cancelBtn.classList.add('d-none');
    createBtn.classList.remove('d-none')
}

const OnUpdateHander = (e) => {
    let updateId = localStorage.getItem("editId");
    localStorage.clear();
    let updateUrl = `${baseUrl}posts/${updateId}`;
    let post = {
        title: titleControl.value,
        body: contentControl.value
    }
    formContainer.reset()
    updateBtn.classList.add('d-none');
    cancelBtn.classList.add('d-none');
    createBtn.classList.remove('d-none')
    createApiCall('PATCH', updateUrl, JSON.stringify(post))
}

const OndeletePopUpShow = (e) => {
    let deleteId = e.closest('.card').id;
    localStorage.setItem('deleteId' , deleteId)
    fadeModel.classList.toggle('visible');
    fadeOverley.classList.toggle('visible')
    
}

const OndeletePopUpHide = (e) => {
    fadeModel.classList.toggle('visible');
    fadeOverley.classList.toggle('visible')
    
}

const OndeleteHandler = (e) => {
    let deleteItem = localStorage.getItem('deleteId');
    localStorage.setItem('deleteItem' , deleteItem)
    let deleteUrl = `${baseUrl}posts/${deleteItem}`
    createApiCall('DELETE' , deleteUrl);
    fadeModel.classList.toggle('visible');
    fadeOverley.classList.toggle('visible')

}

formContainer.addEventListener('submit', onSubmitHandler);
cancelBtn.addEventListener('click', onCancelHandler);
updateBtn.addEventListener('click', OnUpdateHander);
hideFade.forEach(ele => ele.addEventListener('click' , OndeletePopUpHide ));
deleteBtn.addEventListener('click' , OndeleteHandler)
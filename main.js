LoadData();
function LoadData() {
    //HTTP Request GET, GET1, PUT, POST, DELETE
    fetch('http://localhost:3000/posts').then(
        function (data) {
            return data.json()
        }
    ).then(
        function (posts) {
            let body = document.getElementById('post-body')
            body.innerHTML = "";
            for (const post of posts) {
                body.innerHTML += convertDataToHTML(post);
            }
        }
    ).catch(
        function (err) {
            console.log(err);
        }
    )
}
function convertDataToHTML(post) {
    return `<tr>
        <td>${post.id}<td>
        <td>${post.title}<td>
        <td>${post.views}<td>
        <td><input type='submit' value='delete' onclick='Delete(${post.id})'/><td>
    </tr>`
}
function saveData() {
    let id = document.getElementById("id_txt").value;
    let title = document.getElementById("title_txt").value;
    let view = document.getElementById('views_txt').value;
    fetch('http://localhost:3000/posts/' + id).then(
        function (res) {
            if (res.ok) {
                fetch('http://localhost:3000/posts/'+id, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            title: title,
                            views: view
                        })
                }).then(function (res) {
                    if (res.ok) {
                        console.log("thanh cong");
                    }
                }).catch(function (err) {
                    console.log(err);
                })
                return false;
            } else {
                //POST
                fetch('http://localhost:3000/posts', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(
                        {
                            id: id,
                            title: title,
                            views: view
                        })
                }).then(function (res) {
                    if (res.ok) {
                        console.log("thanh cong");
                    }
                }).catch(function (err) {
                    console.log(err);
                })
                return false;
            }
        }
    )



}
function Delete(id) {
    fetch('http://localhost:3000/posts/' + id, {
        method: "delete"
    })
        .then(function (res) {
            if (res.ok) {
                console.log("xoa thanh cong");
                LoadData();
            }
        })

}
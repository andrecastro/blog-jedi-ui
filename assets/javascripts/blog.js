const jediImages = [
    "https://orig00.deviantart.net/d5b6/f/2007/234/6/2/jedi_boy_color_by_maldav.jpg",
    "https://i.pinimg.com/236x/b2/01/44/b201445ffac7b2b3562274a09e7ff28b--star-wars-jedi-star-wars-art.jpg",
    "https://pbs.twimg.com/media/BvlIEfIIgAAFKHQ.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSgk19nBKoAGGDMG7UXEjBtGzY56O1k9IgB9V_f6KtxJ8uyiK-Zyg",
    "https://dncache-mauganscorp.netdna-ssl.com/thumbseg/600/600481-bigthumbnail.jpg",
    "https://pre00.deviantart.net/665d/th/pre/i/2010/307/9/1/jedi_concept_by_jongon-d323vxa.jpg",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSD7d0KMExdh4400Yvw0EgtiUnB-D2DO6DzVDoDdTWvLpSy2q19",
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQON6cvgGTdLiuiIKVKswyO1B-zDdSWfqGUcDFZwpS19zGEbUu5",
    "https://img00.deviantart.net/8f37/i/2008/168/4/0/jedi_girl_komoshi_collaberate_by_scotee.jpg",
    "https://pre00.deviantart.net/6901/th/pre/i/2013/045/b/e/dark_jedi_by_felipeborbs-d5uy26l.jpg"
];

const index = Math.floor((Math.random() * 10));
const currentAuthor = {
    name: "Jedi " + index,
    picture: jediImages[index]
};

const postsResourceEndpoint = 'https://km9ndxetuf.execute-api.us-east-1.amazonaws.com/dev/posts';

Vue.use(Buefy.default);

const App = new Vue({
    el: '#app',
    data: {
        pageData: {
            blogTitle: 'Blog Jedi',
            blogDescription: 'Blog do Jedi Academy',
            blogPosts: []
        },
        blogComments: [],
        selectedBlog: {},
        isShowBlogPostDialog: false,
        isShowCommentDialog: false,
        commentText: '',
        isNewPost: true,
        editPostIndex: 0,
        currentPost: {},
        defaultPostAttributes: {
            "title": "",
            "picture": currentAuthor.picture,
            "author": currentAuthor.name,
            "text": "",
            "comments": []
        },
        defaultCommentsAttributes: {
            "author": currentAuthor.name,
            "picture": currentAuthor.picture,
            "text": ""
        }
    }
});

// ----------------- Post section ------------------------
function openCreatePostModal() {
    App.currentPost = clone(App.defaultPostAttributes);
    App.isNewPost = true;
    App.isShowBlogPostDialog = true;
}

function openEditPostModal(post, idx) {
    App.currentPost = clone(post);
    App.isNewPost = false;
    App.editPostIndex = idx;
    App.isShowBlogPostDialog = true;
}

function savePost() {
    let post = App.currentPost;

    App.$http.post(postsResourceEndpoint, post).then(response => {
        App.pageData.blogPosts.push(response.data);
        App.isShowBlogPostDialog = false;
    }, response => {
        App.isShowBlogPostDialog = false;
        alert("Erro ao salvar post")
    })
}

function updatePost() {
    let post = App.currentPost;

    App.$http.put(postsResourceEndpoint, post).then(response => {
        App.pageData.blogPosts[App.editPostIndex] = response.data;
        App.isShowBlogPostDialog = false;
    }, response => {
        App.isShowBlogPostDialog = false;
        alert("Erro ao atualizar post")
    })
}

function deletePost(post, idx) {
    if (confirm("Deseja realmente excluir o Blog Post")) {
        App.$http.delete(postsResourceEndpoint, {body: post }).then(response => {
            App.pageData.blogPosts.splice(idx, 1);
        }, response => {
            alert("Erro ao deletar post")
        });
    }
}

// ----------------- Comment section -----------------
function openCommentModal(blog) {
    App.blogComments = blog.comments;
    App.selectedBlog = blog;
    App.commentText = '';
    App.isShowCommentDialog = true;
}

function addComment(blog) {
    let comment = clone(App.defaultCommentsAttributes);
    comment.text = App.commentText = '';

    App.selectedBlog.comments.push(comment);
}

function loadData(endpoint) {
    App.$http.get(endpoint).then(
        response => {
            console.log(response);
            console.log(response.data);
            App.pageData.blogPosts = response.data;
        });
}

loadData(postsResourceEndpoint);

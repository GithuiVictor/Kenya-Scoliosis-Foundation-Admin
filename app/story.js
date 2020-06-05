class Story {
    static addStory(form) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        if (uploadedFile) {
            data.append('image', uploadedFile, uploadedFile.name);
            uploadedFile = null;
        }
        data.append('description', quill.root.innerHTML);
        axios.post(`/stories`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                location.href = 'adminBlog.html';
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static updateStory(form, storyId) {
        $('.loading-overlay').show();
        let data = new FormData(form[0]);
        if (uploadedFile) {
            data.append('image', uploadedFile, uploadedFile.name);
            uploadedFile = null;
        }
        data.append('description', quill.root.innerHTML);
        axios.put(`/stories/${storyId}`, data)
            .then(function (response) {
                $('.loading-overlay').hide();
                toastr.success('Article has been updated successfully')
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static getStories() {
        $('.loading-overlay').show();
        axios.get(`/stories`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const storiesContainer = $('#stories-container');
                storiesContainer.empty();
                response.data.forEach(story => {
                    storiesContainer.append(storyCard(story));
                });
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }

    static async getStoryDetails(storyId) {
        $('.loading-overlay').show();
        axios.get(`/stories/${storyId}`)
            .then(function (response) {
                $('.loading-overlay').hide();
                const story = response.data;
                $('.article-name').text(story.title).val(story.title);
                $('.article-shortDescription').val(story.shortDescription);
                $('.article-tag').val(story.tag);
                quill.root.innerHTML = story.description;
                if (story.image) {
                    $('.article-image').empty().append(`<img src="${story.image}" alt="Article Image"/>`);
                }
            })
            .catch(function (error) {
                defaultErrorHandler(error);
            });
    }
}

const urlParams = new URLSearchParams(window.location.search);
const storyId = urlParams.get('story');

const storyForm = $('#story-form');
storyForm.on('submit', (e) => {
    e.preventDefault();
    Story.addStory(storyForm);
});

const updateStoryForm = $('#update-story-form');
updateStoryForm.on('submit', (e) => {
    e.preventDefault();
    Story.updateStory(updateStoryForm, storyId);
});

$(document).ready(() => {
    Story.getStories();

    if (storyId) {
        Story.getStoryDetails(storyId);
    }
});

const storyCard = (story) => {
    return `
        <div class="blog-post mb-3 py-4 px-4">
                <div class="row">
                    <!--Article Image-->
                    <div class="col-sm-4">
                        <img src="${story.image}" alt="blog-img" class="img-fluid">
                    </div>
                    <!--Article Details-->
                    <div class="col-sm-8 d-flex justify-content-between">
                        <div>
                            <a href="#">
                                <h2 class="blogName">${story.title}</h2>
                            </a>
                            <p class="text-muted">  
                                <span class="mr-3"><i class="far fa-calendar-alt mr-1">${moment(story.createdAt).format('MMMM Do YYYY')}</i></span>
                                <span><i class="far fa-clock mr-1"></i>${moment(story.createdAt).format('h:mm a')}</span>
                            </p>
                            <p class="text-muted">
                                <span class="mr-2"><i class="far fa-comment-alt"></i></span>
                                10 Comments (Static: TODO)
                            </p>
                        </div>
                        <div class="text-right text-secondary mt-5">
                            <a href="adminBlogDetails.html?story=${story.id}">
                                <button class="btn btn-success">Details</button>
                            </a>
                            <a href="#" id="delete-story">
                                <button class="btn btn-success" data-toggle="modal" data-target="#delete-article">Delete</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
    `;
}

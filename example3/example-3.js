Example3 = {};

Example3.Actions = (model) => {

    return {
        getPosts: (id = "", brokenUrl) => {
            let url = brokenUrl || `${model.apiUrl}/posts/${id}`;

            /*
            *   Key points with using jQuery:
            *   1. make sure to return the $.ajax/get/post object to
                   componentizer so it can handle view rendering
            *   2. use catch/then rather than fail/success/done
            *   3. make sure to return the model in your then handler
            *   4. adding a catch here is optional (i.e. componentizer
                   will fail gracefully either way) but highly recommended
            */
            return $.get(url)
                .catch((result) => {
                    if (result.readyState === 4) {
                        model.errorMessage = `Sorry! We couldn't find any posts.`;    
                    } else if (result.readyState === 0) {
                        model.errorMessage = `We couldn't get any posts due to a network error.`
                    } else {
                        model.errorMessage = "Something went wrong.";
                    }
                })
                .then((result) => {
                    model.posts = result && result.length ? result : [result];
                    return model;
                });
        },
        testES6Promise: () => {
            return new Promise((resolve, reject) => {
                let rand = Math.floor(Math.random()*10 + 1);
                setTimeout(() => {
                    model.randomNumber = rand;
                    if (rand > 3) {
                        resolve(model);
                    } else {
                        model.errorMessage = "Error: less than 3";
                        reject({reason: model.errorMessage, model: model});
                    }
                }, 2000);
            });
        },
        clear: () => {
            model.posts = [];
        }
    };
};

Example3.View = () => {
    const COMPONENT = $("[data-component=example-3]");
    
    const BUTTON_GET_POSTS = COMPONENT.find("[data-selector=example-3-get-posts]");
    const BUTTON_GET_POSTS_404 = COMPONENT.find("[data-selector=example-3-get-posts-404]");
    const BUTTON_GET_POSTS_ERROR_NETWORK = COMPONENT.find("[data-selector=example-3-get-posts-error-network]");
    const BUTTON_TEST_ES6_PROMISE = $("[data-selector=example-3-es6-promise]");
    const POSTS = COMPONENT.find("[data-selector=example-3-posts]");
    const ERROR_MESSAGE = COMPONENT.find("[data-selector=example-3-error-message]");

    function renderPost(post) {
        return post != null
            ? $("<div/>")
                .addClass("post")
                .attr("data-post-id", post.id)
                .append(
                    $("<h5/>")
                        .addClass("post-title")
                        .text(post.title)
                )
                .append(
                    $("<article/>")
                        .addClass("post-body")
                        .text(post.body)
                )
                .append(
                    $("<hr/>")
                )
            : "";
    };

    return {
        init: (actions, model) => {
            BUTTON_GET_POSTS.on("click", () => actions.getPosts());
            BUTTON_GET_POSTS_404.on("click", () => actions.getPosts(999));
            BUTTON_GET_POSTS_ERROR_NETWORK.on("click", () => actions.getPosts(1, "https://jsonplaceholder.typicode.cm/posts"))
            BUTTON_TEST_ES6_PROMISE.on("click", actions.testES6Promise);
        },
        render: (model) => {
            if (model.posts != null && model.posts.length > 0) {
                POSTS.html(model.posts.map(renderPost));
            }

            if (model.errorMessage != null && model.errorMessage !== ""){
                ERROR_MESSAGE.text(model.errorMessage).fadeIn();
            } else {
                ERROR_MESSAGE.text(model.errorMessage).hide();
            }
            console.log(model.randomNumber);
        }
    };
};
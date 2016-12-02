Example3 = {
    JQuery: {},
    ES6: {}
};

Example3.JQuery.Actions = (model) => {

    return {
        getPosts: (id = "", brokenUrl) => {
            let url = brokenUrl || `${model.apiUrl}/posts/${id}`;
            model.errorMessage = "";
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
        }
    };
};

Example3.JQuery.View = () => {
    const COMPONENT = $("[data-component=example-3-jquery]");
    
    const BUTTON_GET_POSTS = COMPONENT.find("[data-selector=jquery-get-posts]");
    const BUTTON_GET_POSTS_404 = COMPONENT.find("[data-selector=jquery-get-posts-404]");
    const BUTTON_GET_POSTS_ERROR_NETWORK = COMPONENT.find("[data-selector=jquery-get-posts-error-network]");
    const POSTS = COMPONENT.find("[data-selector=jquery-posts]");
    const ERROR_MESSAGE = COMPONENT.find("[data-selector=jquery-error-message]");

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
        }
    };
};

Example3.ES6.Actions = (model) => {

    return {
        /*
        *   Key points with using ES6 Promises:
        *   1. make sure to return the $.ajax/get/post object to
               componentizer so it can handle view rendering
        *   2. use catch/then rather than fail/success/done
        *   3. make sure to return the model in your then handler
        *   4. adding a catch here is optional (i.e. componentizer
               will fail gracefully either way) but highly recommended
        */
        getRandomNumber: () => {
            model.errorMessage = "";
            model.numberMessage = "Generating...";
            return new Promise((resolve, reject) => {
                let rand = Math.floor(Math.random()*10 + 1);
                setTimeout(() => {
                    model.numberMessage = `Random number: ${rand}`;

                    if (rand < 5) {
                        reject(model);
                    } else {
                        resolve(model);
                    }
                }, 800);
            })
            .catch((result) => {
                model.errorMessage = "Error: less than 5";
                return model;
            })
            .then((model) => {
                return model;
            });
        },
        clear: () => {
            model.posts = [];
        }
    };
};

Example3.ES6.View = () => {
    const COMPONENT = $("[data-component=example-3-es6]");

    const BUTTON_GET_NUMBER = COMPONENT.find("[data-selector=es6-get-number]");
    const RANDOM_NUMBER_MESSAGE = COMPONENT.find("[data-selector=es6-number-message]");
    const ERROR_MESSAGE = COMPONENT.find("[data-selector=es6-error-message]");

    return {
        init: (actions, model) => {
            BUTTON_GET_NUMBER.on("click", actions.getRandomNumber);
        },
        render: (model) => {
            if (model.errorMessage != null && model.errorMessage !== ""){
                ERROR_MESSAGE.text(model.errorMessage).fadeIn();
            } else {
                ERROR_MESSAGE.text(model.errorMessage).hide();
            }
            if (model.numberMessage) {
                RANDOM_NUMBER_MESSAGE.text(model.numberMessage);
            }
        }
    };
};
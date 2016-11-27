/**
 * Created by bjefferis on 23/11/2016.
 */

RandomUser = {};

RandomUser.Actions = (model) => {
    return {
        getUser: () => {
            model = {};

            return new Promise((resolve, reject) => {
                let id = Math.floor(Math.random() * 15 + 1);

                $.get(`https://jsonplaceholder.typicode.com/users/${id}`, {}, (user) => {
                    if (user == null) {
                        reject("Failed to retrieve user");
                    }
                    model.name = user.name || "";
                    model.email = user.email || "";
                    model.phone = user.phone || "";
                    model.website = user.website || "";

                    resolve(model);
                }).fail(() => {
                    model.errorMessage = "Sorry, we couldn't find a user";
                    reject({reason: `User with id: ${id} not found`, model: model});
                });
            });
        }
    };
};

RandomUser.View = (model) => {
    const COMPONENT = $("[data-component=random-user]");

    const ERROR_MESSAGE = COMPONENT.find("[data-selector=random-user-error-message]");
    const DETAILS = COMPONENT.find("[data-selector=random-user-details]");
    const LABEL_NAME = COMPONENT.find("[data-selector=random-user-name]");
    const LABEL_EMAIL = COMPONENT.find("[data-selector=random-user-email]");
    const LABEL_PHONE = COMPONENT.find("[data-selector=random-user-phone]");
    const LABEL_WEBSITE = COMPONENT.find("[data-selector=random-user-website]");

    return {
        init: (actions, model) => {

        },
        render: (model) => {
            ERROR_MESSAGE.text(model.errorMessage);
            if (model.errorMessage != null && model.errorMessage !== "") {
                ERROR_MESSAGE.fadeIn();
            } else {
                ERROR_MESSAGE.hide();
            }

            if (model.name == null || model.name === "") {
                DETAILS.hide();
            } else {
                DETAILS.fadeIn();
            }

            LABEL_NAME.text(model.name);
            LABEL_EMAIL.text(model.email);
            LABEL_PHONE.text(model.phone);
            LABEL_WEBSITE.text(model.website);
        }
    };
};

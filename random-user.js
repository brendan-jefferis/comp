/**
 * Created by bjefferis on 23/11/2016.
 */

RandomUser = {};

RandomUser.Actions = (model, render) => {
    return componentize({
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
    }, model, render);
};

RandomUser.Render = (model) => {
    console.log("rendering random user...");
    const Selector = {
        COMPONENT: "[data-component=random-user]",
        P_ERROR_MESSAGE: "[data-selector=random-user-error-message]",
        DIV_DETAILS: "[data-selector=random-user-details]",
        LABEL_NAME: "[data-selector=random-user-name]",
        LABEL_EMAIL: "[data-selector=random-user-email]",
        LABEL_PHONE: "[data-selector=random-user-phone]",
        LABEL_WEBSITE: "[data-selector=random-user-website]"
    };

    const component = $(Selector.COMPONENT);

    function update(model) {
        if (model.errorMessage != null && model.errorMessage !== "") {
            component.find(Selector.P_ERROR_MESSAGE).text(model.errorMessage).fadeIn();
        } else {
            component.find(Selector.P_ERROR_MESSAGE).text(model.errorMessage).hide();
        }

        if (model.name == null || model.name === "") {
            component.find(Selector.DIV_DETAILS).hide();
        } else {
            component.find(Selector.DIV_DETAILS).fadeIn();
        }

        component.find(Selector.LABEL_NAME).text(model.name);
        component.find(Selector.LABEL_EMAIL).text(model.email);
        component.find(Selector.LABEL_PHONE).text(model.phone);
        component.find(Selector.LABEL_WEBSITE).text(model.website);
    }

    update(model);
};

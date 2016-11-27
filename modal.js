/**
 * Created by bjefferis on 23/11/2016.
 */
Modal = {};

Modal.Actions = function (model) {
    return {
        show: function(content) {
            model.content = content.toString();
            model.showModal = model.content != null && model.content.trim() !== "";
        },

        close: function () {
            model.content = "";
            model.showModal = false;
        }
    };
}

Modal.View = function () {
    const COMPONENT = $("[data-component=modal]");
    
    const MODAL_CONTENT = COMPONENT.find("[data-selector=modal-content]");
    const BUTTON_CLOSE = COMPONENT.find("[data-selector=button-close]");

    return {
        init: (actions, model) => {
            COMPONENT.children().on("click", (e) => { e.stopPropagation(); });
            COMPONENT.on("click", (e) => {
                actions.close();
            });
            BUTTON_CLOSE.on("click", actions.close);
        },
        render: (model) => {
            if (model.content != null && model.content.trim() !== "") {
                MODAL_CONTENT.html(model.content);
            }

            if (model.showModal) {
                COMPONENT.fadeIn();
            } else {
                COMPONENT.fadeOut();
            }
        }
    };
}

/**
 * Created by bjefferis on 23/11/2016.
 */
 Example5 = window.Example5 || {
    Greeter: {},
    Modal: {}
};

Example5.Modal.Actions = (model) => {

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
};

Example5.Modal.View = () => {
    const COMPONENT = $("[data-component=modal]");
    
    const MODAL_CONTENT = COMPONENT.find("[data-selector=modal-content]");
    const BUTTON_CLOSE = COMPONENT.find("[data-selector=button-close]");

    return {
        init: (actions) => {
            COMPONENT.children().on("click", (e) => { e.stopPropagation(); });
            COMPONENT.on("click", actions.close);
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
};

comp.create("modal", Example5.Modal.Actions, Example5.Modal.View, {
    content: "",
    showModal: false
});
import comp from "../../componentizer";

window.Example6 = window.Example6 ? window.Example6 : {};

Example6.Modal = {};

Example6.Modal.Actions = (model) => {

    return {
        show: function(content) {
            if (typeof content === "string") {
                content.trim();
            }
            model.content = content;
            model.showModal = model.content != null && model.content !== "";
        },

        close: function () {
            model.content = "";
            model.showModal = false;
        }
    };
};

Example6.Modal.View = () => {
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
            if (model.content != null && model.content !== "") {
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

comp.create("modal", Example6.Modal.Actions, Example6.Modal.View);
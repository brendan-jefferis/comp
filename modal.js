/**
 * Created by bjefferis on 23/11/2016.
 */
Modal = {};

Modal.Actions = function (model) {
    return {
        setContent: function(content) {
            model.content = content.toString();
            model.showModal = model.content != null && model.content.trim() !== "";
        },

        closeModal: function () {
            model.content = "";
            model.showModal = false;
        }
    };
}

Modal.Render = function (model) {
    const COMPONENT = $("[data-component=modal]");
    const MODAL_CONTENT = COMPONENT.find("[data-selector=modal-content]");

    return () => {
        if (model.content != null && model.content.trim() !== "") {
            MODAL_CONTENT.html(model.content);
        }

        if (model.showModal) {
            COMPONENT.fadeIn();
        } else {
            COMPONENT.fadeOut();
        }
    };
}

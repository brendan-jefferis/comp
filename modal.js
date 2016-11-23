/**
 * Created by bjefferis on 23/11/2016.
 */
Modal = {};

Modal.Actions = function (model, render) {
    return componentize({
        setContent: function(content) {
            model.content = content.toString();
            model.showModal = model.content != null && model.content.trim() !== "";
        },

        closeModal: function () {
            model.content = "";
            model.showModal = false;
        }
    }, model, render);
}

Modal.Render = function (model) {
    console.log("rendering modal");
    var component = document.querySelector("[data-component=modal]");

    function update(model) {
        if (model.content != null && model.content.trim() !== "") {
            component.querySelector("[data-selector=modal-content]").innerHTML = model.content;
        }

        component.style.display = model.showModal ? "block" : "none";
    }

    update(model);
}

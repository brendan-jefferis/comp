/**
 * Created by bjefferis on 23/11/2016.
 */
function Modal(model) {
    model = model || {};
    this.Render(model);
    return this.Actions(model, this.Render);
}

Modal.prototype.Actions = function (model, render) {
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

Modal.prototype.Render = function (model) {
    var component = document.querySelector("[data-component=modal]");

    function update(model) {
        if (model.content != null && model.content.trim() !== "") {
            component.querySelector("[data-model=modal-content]").innerHTML = model.content;
        }

        component.style.display = model.showModal ? "block" : "none";
    }

    update(model);
}

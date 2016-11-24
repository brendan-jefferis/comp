/**
 * Created by bjefferis on 23/11/2016.
 */

Address = {};

Address.Actions = (model) => {
    return {
        validateName: (str) => {
            model.name = str;
            model.isValid = model.name !== "" && model.name != null;
            model.validationMessage = model.isValid ? "" : "Please enter your name";
        },
        save: () => {

        }
    };
};

Address.Render = (model) => {
    console.log("rendering address");
    var component = document.querySelector("[data-component=address]");

    function update(model) {

        var validation = component.querySelector("[data-selector=validation]");
        validation.innerText = model.validationMessage;
        validation.style.display = model.isValid === false ? "block" : "none";

        component.querySelector("[data-selector=address-name]").value = model.name;
        component.querySelector("[data-selector=address-line-1]").value = model.line1;
        component.querySelector("[data-selector=address-line-2]").value = model.line2;
        component.querySelector("[data-selector=address-city]").value = model.city;
        component.querySelector("[data-selector=address-country]").value = model.country;
    }

    update(model);
};

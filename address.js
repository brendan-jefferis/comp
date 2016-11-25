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
    const COMPONENT = $("[data-component=address]");
    const VALIDATION = COMPONENT.find("[data-selector=validation]");
    const INPUT_NAME = COMPONENT.find("[data-selector=address-name]");
    const INPUT_LINE1 = COMPONENT.find("[data-selector=address-line-1]");
    const INPUT_LINE2 = COMPONENT.find("[data-selector=address-line-2]");
    const INPUT_CITY = COMPONENT.find("[data-selector=address-city]");
    const INPUT_COUNTRY = COMPONENT.find("[data-selector=address-country]");

    return () => {
        VALIDATION.text(model.validationMessage);
        if (model.isValid === false) {
            VALIDATION.fadeIn();
        } else {
            VALIDATION.hide();
        }

        INPUT_NAME.val(model.name);
        INPUT_LINE1.val(model.line1);
        INPUT_LINE2.val(model.line2);
        INPUT_CITY.val(model.city);
        INPUT_COUNTRY.val(model.country);
    };
};

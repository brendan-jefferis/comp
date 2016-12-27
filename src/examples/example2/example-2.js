Example2 = {};

const model = {
    name: "b",
    num: 0,
    message: "waiting.."
};

Example2.Actions = (model) => {
    return {
        setName: (name) => {
            model.name = name;
        },
        setNumber: (num) => {
            model.num = num;
        },
        clear: () => {
            model.name = "";
            model.num = 0;
        }
    };
};

Example2.View = () => {
    return {
        render: (model) => {
            return `
                <p>
                    <label for="number">Choose a number</label>
                    <select id="number" data-change="setNumber(this.value)">
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                    </select>
                    <label for="example-2-your-name">Enter your name</label>
                    <input type="text" id="example-2-your-name" data-keyup="setName(this.value)" value="${model.name}">
                    <button data-click="clear">Clear</button>
                </p>

                <h4>${model.message}</h4>
                <h1>${model.name} ${model.num}</h1>
            `
        }
    };
};

comp.create("example2", Example2.Actions, Example2.View, model);
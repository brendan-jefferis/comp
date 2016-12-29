Example2 = {};

const model = {
    name: "",
    num: 0,
    list: [
        { value: 1, text: "one", selected: false },
        { value: 2, text: "two", selected: false },
        { value: 3, text: "three", selected: false },
        { value: 4, text: "four", selected: false },
        { value: 5, text: "five", selected: false }
    ]
};

Example2.Actions = (model) => {
    return {
        setName: (name) => {
            model.name = name;
        },
        setOption: (val) => {
            model.list.map(x => x.selected = x.value === val);
            model.num = val;
        },
        clear: () => {
            model.name = "";
            model.num = 0;
        }
    };
};

Example2.View = () => {

    function renderListItemAsOption(item) {
        const selected = item.selected ? "selected" : "";
        return `<option value="${item.value}" ${selected}>${item.text}</option>`;
    }

    function renderListItemAsRadio(item, name) {
        return `<li><input type="radio" name="name" data-click="setOption(this.value)" value="${item.value}">${item.text}</li>`;
    }

    return {
        render: (model) => {
            return `
                <div>
                    <p>
                        <label for="number">Choose a number</label>
                        <select id="number" data-change="setOption(this.value)">
                            <option value="0">-Select-</option>
                            ${model.list.map(renderListItemAsOption)}
                        </select>
                        <label for="example-2-your-name">Enter your name</label>
                        <input type="text" id="example-2-your-name" data-keyup="setName(this.value)" value="${model.name}">
                        <button data-click="clear">Clear</button>
                        
                        <ul>
                            ${model.list.map(i => renderListItemAsRadio(i, "list"))}
                        </ul>
                    </p>
    
                    <h1>${model.name} ${model.num}</h1>
                </div>
            `
        }
    };
};

comp.create("example2", Example2.Actions, Example2.View, model);
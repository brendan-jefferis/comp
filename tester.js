/**
 * Created by bjefferis on 23/11/2016.
 */

Tester = {};

Tester.Model = {
	result: {}
};

function spec(name, suite) {
	Tester.Model.suiteName = name;
	suite();
};

function assert(description, test) {
	test();
	Tester.Model.result.description = description;
	Tester.Render(Tester.Model);
};

function expect(result) {
	const passMessage = "Passed!";

	return {
		toBe: (expected) => {
			let passed = result === expected;
			Tester.Model.result.passed = passed,
			Tester.Model.result.message = passed ? "Passed!" : `Failed: expected ${expected} but got ${result}`
		}
	}
};

Tester.Render = (model) => {
    var component = document.querySelector("[data-component=tester]");

    function update(model) {
    	if (model.result == null) {
    		return;
    	}
		let p = document.createElement("p");
		p.innerText = `${model.result.description} : `;
		let span = document.createElement("span");
		span.className = model.result.passed ? "passed" : "failed";
		span.innerText = model.result.message;
		p.appendChild(span);

        component.querySelector("[data-selector=results]").appendChild(p);
    }

	update(model);
};
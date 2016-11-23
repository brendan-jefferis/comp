var address = new Component(Address.Actions, Tester.Render, {
	name: "Billy",
	line1: "123 Example St",
    line2: "Ocean View",
    city: "Citysville",
    country: "New Zealand"
});

spec("address.js", () => {
	assert("Should be able to set valid name", () => {
		address.validateName("bob");
		expect(address.get("name")).toBe("bob");
	});

	assert("Empty name should not be valid", () => {
		address.validateName("");
		expect(address.get("isValid")).toBe(false);
	});

	assert("Numbers should not be valid name", () => {
		address.validateName("5");
		expect(address.get("isValid")).toBe(false);
	});
});
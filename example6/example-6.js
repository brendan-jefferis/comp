Example6 = {};

Example6.Actions = (model) => {

	return {
		getUsers: () => {
			return $.get(`${model.apiUrl}/users`)
				.catch((result) => {
					if (result.readyState === 4) {
                        model.errorMessage = `Sorry! We couldn't find any users.`;    
                    } else if (result.readyState === 0) {
                        model.errorMessage = `We couldn't get any users due to a network error.`
                    } else {
                        model.errorMessage = "Something went wrong.";
                    }
				})
				.then((result) => {
					model.users = result;
					return model;
				});
		}
	}
};

Example6.View = () => {
	const COMPONENT = $("[data-component=example-6]");
	const BUTTON = COMPONENT.find("[data-selector=get-user-list]");
	const USER_LIST = COMPONENT.find("[data-selector=user-list]");

	function renderUserList(users) {
		return $("<ul/>")
			.append(users.map(renderUser));
	}

	function renderUser(user) {
		return $("<li/>")
			.append(
				$("<span/>")
					.attr("class", "user-name")
					.text(user.name)
			)
			.append(
				$("<button>")
					.attr("data-selector", `show-user-details`)
					.attr("data-user-id", user.id)
					.text("View details")
			)
	}

	function renderUserDetails(user) {
		return user
			? $("<div/>")
				.append(
					$("<p/>")
						.text(`Email: ${user.email}`)
				)
				.append(
					$("<p/>")
						.text(`Phone: ${user.phone}`)
				)
			: "";
	}

	return {
		el: {
			USER_DETAILS: "[data-selector=show-user-details]"
		},
		init: (actions) => {
			BUTTON.on("click", actions.getUsers);
		},
		dynamicEvents: (model) => {
			COMPONENT.off().on("click", "[data-selector=show-user-details]", (e) => {
				var user = model.users.find((x) => { return x.id === parseInt(e.currentTarget.getAttribute("data-user-id"), 10); });
				_comp.components.modal.show(renderUserDetails(user));
			});
		},
		render: (model) => {
			if (model.users) {
				USER_LIST.html(renderUserList(model.users));
			}
		}
	}
}
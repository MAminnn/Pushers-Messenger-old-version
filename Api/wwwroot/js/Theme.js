const Theme = {
	dark: "theme-dark",
	light: "theme-light",
	
	changeTheme: () => {
		const html = $("html");
		if (html.attr("class") === Theme.light) html.attr("class", Theme.dark);
		else html.attr("class", Theme.light);
	}
}
/* functions */
let pageType = 1;
/* changes the active tab */
function setAsActiveTab(el) {
    $("#tab-bar")[0].childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) node.classList.remove("active-tab");
    });
    el.classList.add("active-tab");
}

/* opens login form */
function openLoginForm(el) {
    pageType = 1;
    setAsActiveTab(el);
    $("#login-form")[0].style.transform = "translateX(0)";
    $("#register-form")[0].style.transform = "translateX(-100%)";
}

/* opens register form */
function openRegisterForm(el) {
    pageType = 2;

    setAsActiveTab(el);
    $("#register-form")[0].style.transform = "translateX(0)";
    $("#login-form")[0].style.transform = "translateX(100%)";
}
if (document.getElementById("pageType").getAttribute("value") === "1") {
    $("#login-form")[0].style.transform = "translateX(0)";
    $("#register-form")[0].style.transform = "translateX(-100%)";

} else {
    $("#register-form")[0].style.transform = "translateX(0)";
    $("#login-form")[0].style.transform = "translateX(100%)";

}
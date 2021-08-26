var root = 0;

var confirmation = false;

function root_get(property) {
    let rs = getComputedStyle(root);
    return rs.getPropertyValue(property);
}

function root_set(property, value) {
    root.style.setProperty(property, value);
}

function back() {
    window.history.back();
}

function check_confirmation() {
    let reset = confirm("You sure you want to reset all? \n\nCaution: This action cannot be undone");
    if (reset) {
        localStorage.clear();
        sessionStorage.clear();
        window.location.reload()
        window.location.href = "/"
    }
}


function start() {
    root = document.querySelector(":root");
}
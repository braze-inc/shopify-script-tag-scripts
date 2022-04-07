function loadPage(pageUrl) {
    console.log("Loading " + pageUrl + " DOM into <main>...");
    fetch(pageUrl)
    .then((response) => response.text())
    .then((html) => {
        // document.body.innerHTML = document.body.innerHTML + html;
        // document.body.getElementsByTagName('main')[0].innerHTML = document.body.getElementsByTagName('main')[0].innerHTML + html;
        document.body.getElementsByTagName('main')[0].innerHTML += html;
    })
    .catch((error) => {
        console.warn(error);
    });
};
function loadCss(cssId, cssUrl) {
    console.log("Ensuring loading of CSS " + cssUrl + "...");
    if (!document.getElementById(cssId)) {
        var linkElement  = document.createElement('link');
        linkElement.id   = cssId;
        linkElement.rel  = 'stylesheet';
        linkElement.type = 'text/css';
        linkElement.href = cssUrl;
        linkElement.media = 'all';
        var head  = document.getElementsByTagName('head')[0];
        head.appendChild(linkElement);
    }
};
function loadJs(jsId, jsUrl) {
    console.log("Ensuring loading of JS " + jsUrl + "...");
    if (!document.getElementById(jsId)) {
        var scriptElement = document.createElement('script');
        scriptElement.src = jsUrl;
        scriptElement.id = jsId;
        var head  = document.getElementsByTagName('head')[0];
        head.appendChild(scriptElement);
    }
}
function doAfterPresent(id, action) {
    console.log("Waiting for existence of ID " + id + " before performing action...");
    if (document.getElementById(id)) {
	console.log("Present, doing it...");
	action();
    } else {
	console.log("Not available yet, waiting .5s...");
	setTimeout(doAfterPresent(id, action), 500);
    }
}

loadCss("sliderCss", "https://braze-inc.github.io/shopify-script-tag-scripts/slider-test.css");
loadCss("bootstrapCss", "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");
loadJs("jqueryJs", "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js");
doAfterPresent("jqueryJs", function() { loadJs("bootstrapJs", "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"); });
//loadJs("bootstrapJs", "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js");
loadPage("https://braze-inc.github.io/shopify-script-tag-scripts/slider-test.html");


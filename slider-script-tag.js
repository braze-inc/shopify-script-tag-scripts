function loadPage(pageUrl) {
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
    if (!document.getElementById(jsId)) {
        var scriptElement = document.createElement('script');
        scriptElement.src = jsUrl;
        scriptElement.id = jsId;
        var head  = document.getElementsByTagName('head')[0];
        head.appendChild(scriptElement);
    }
}
loadCss("sliderCss", "https://braze-inc.github.io/shopify-script-tag-scripts/slider-test.css");
loadCss("bootstrapCss", "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");
loadJs("jqueryJs", "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js");
loadJs("bootstrapJs", "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js");
loadPage("https://braze-inc.github.io/shopify-script-tag-scripts/slider-test.html");


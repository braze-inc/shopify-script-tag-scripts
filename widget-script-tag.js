function getQueryParameters() {
    const url = new URL([...document.getElementsByTagName("script")]
	.map(script => script.src)
	.find(src => src.includes("widget-script-tag.js")));
    const urlSearch = new URLSearchParams(url.search);
    return Object.fromEntries(urlSearch.entries());
};
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

const urlRoot = "https://braze-inc.github.io/shopify-script-tag-scripts/";
const queryParameters = getQueryParameters();

//loadCss("slider-css", "https://braze-inc.github.io/shopify-script-tag-scripts/slider-test.css");
loadCss("bootstrap-css", "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");

const cssParameter = queryParameters["css"];
if (cssParameter) {
	cssLinks = cssParameter.split("!");
	cssLinks.forEach((cssLink) => {
		if (cssLink !== '') {
			loadCss(cssLink + "-css", urlRoot + cssLink + ".css");
		}
	});
}

var wait = 250;
loadJs("jquery-js", "https://ajax.googleapis.com/ajax/libs/jquery/3.6.0/jquery.min.js");
setTimeout(function() { loadJs("bootstrap-js", "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"); }, wait);
const jsParameter = queryParameters["js"];
if (jsParameter) {
	jsLinks = jsParameter.split("!");
	jsLinks.forEach((jsLink) => {
		if (jsLink !== '') {
			wait += 250;
			setTimeout(function() { loadJs(jsLink + "-js", urlRoot + jsLink + ".js"); }, wait);
		}
	});
}

const htmlParameter = queryParameters["html"];
if (htmlParameter) {
	htmlLinks = htmlParameter.split("!");
	htmlLinks.forEach((htmlLink) => {
		if (htmlLink !== '') {
			wait += 250;
			setTimeout(function() { loadPage(urlRoot + htmlLink + ".html"); }, wait);
		}
	});
}

//setTimeout(function() { loadPage("https://braze-inc.github.io/shopify-script-tag-scripts/slider-test.html"); }, 1000);


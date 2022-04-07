function loadSlider(url) {
    fetch(url)
    .then((response) => response.text())
    .then((html) => {
        document.body.innerHTML = document.body.innerHTML + html;
    })
    .catch((error) => {
        console.warn(error);
    });
};
function loadCss(cssId, cssUrl) {
    if (!document.getElementById(cssId))
    {
        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.id   = cssId;
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = cssUrl;
        link.media = 'all';
        head.appendChild(link);
    }
};
loadHtml("https://braze-inc.github.io/shopify-script-tag-scripts/slider-test.html");
loadCss("sliderCss", "https://braze-inc.github.io/shopify-script-tag-scripts/slider-test.css");
loadCss("bootstrapCss", "https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css");

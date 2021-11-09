function whenInitialized(callback) {
	const interval = 100;
	window.setTimeout(function() {
		if (typeof appboy != "undefined" && appboy.getUser()) {
			callback();
		} else {
			whenInitialized(callback);
		}
	}, interval);
}

function fetchAndLogProduct(productPath, event){
	fetch(productPath+".js")
	  .then(response => response.json())
	  .then(data => {
	  		console.log(productPath+" "+event+" "+data);
	      	appboy.logCustomEvent(event, {
	      		'id': data.id,
	      		'title': data.title,
	      		'price': data.price,
	      		'vendor': data.vendor,
	      		'images': data.images
	      	});
    });
}

function getApiUrlAndApiKeyQueryParams(){
	const url = new URL([...document.getElementsByTagName("script")]
		.map(script => script.src)
		.find(src => src.includes("braze-product-script"))
	);
	const urlSearch = new URLSearchParams(url.search)
	return Object.fromEntries(urlSearch.entries())
}

whenInitialized(function() {
	currentPath = window.location.pathname
	now = Date.now()
	one_day_millis = 86400000
					

	if(currentPath.startsWith("/products/")){      
		var alreadyClickedProducts = JSON.parse(localStorage.getItem('clicked_products') || "{}");

		productName = currentPath.substring(10)
		productLastClickedAt = alreadyClickedProducts[productName] || 0
		if (now-productLastClickedAt > one_day_millis){
			alreadyClickedProducts[productName] = now;
			localStorage.setItem('clicked_products', JSON.stringify(alreadyClickedProducts));
			fetchAndLogProduct(currentPath, 'shopify_product_clicked');
		}      
	}

	if(currentPath.startsWith("/collections/")){
		var observer = new IntersectionObserver(function(products, observer) {
			var alreadyViewedProducts = JSON.parse(localStorage.getItem('viewed_products') || "{}");
			for(var j = 0;j<products.length; j++){
				if(products[j].isIntersecting === true){
					productName = products[j].target.href.substring(products[j].target.href.indexOf("/products/")+10)
					productLastViewedAt = alreadyViewedProducts[productName] || 0
					if(now-productViewedLastAt > one_day_millis){
						alreadyViewedProducts[productName] = now;
						fetchAndLogProduct("/products/"+productName, 'shopify_product_viewed');
					}
					observer.unobserve(products[j].target);
				}
			}
			localStorage.setItem('viewed_products', JSON.stringify(alreadyViewedProducts));

		}, { threshold: [1] });

		products = document.querySelectorAll("[href*='/products/']");
		for(var i=0;i<products.length;i++){
			observer.observe(products[i]);
		}
	}
});

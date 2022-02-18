(function(){
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

	function attemptToLogEvent(event, productPath, cachedProductsStr, now, oneDayMillis) {
		productName = productPath.substring(10)
		const cachedProducts = JSON.parse(localStorage.getItem(cachedProductsStr) || "{}");
		lastEventTimeForProduct = cachedProducts[productName] || 0
		if (now-lastEventTimeForProduct > oneDayMillis){
			cachedProducts[productName] = now;
			localStorage.setItem(cachedProductsStr, JSON.stringify(cachedProducts));
			fetchAndLogProduct(productPath, event);
		}
	}

	whenInitialized(function() {
		currentPath = window.location.pathname
		now = Date.now()
		oneDayMillis = 86400000
		const queryParams = getApiUrlAndApiKeyQueryParams()
		const viewedProductsStr = 'viewed_products'

		if(queryParams["product_click"] == "true" && currentPath.startsWith("/products/")){   
			attemptToLogEvent('shopify_product_clicked', currentPath, 'clicked_products', now, oneDayMillis);
			attemptToLogEvent('shopify_product_viewed', currentPath, viewedProductsStr, now, oneDayMillis);
		}
		if(queryParams["product_view"] == "true" && currentPath.startsWith("/collections/")){
			const observer = new IntersectionObserver(function(products, observer) {
				const alreadyViewedProducts = JSON.parse(localStorage.getItem(viewedProductsStr) || "{}");
				for(const product of products){
					if(product.isIntersecting === true){
						productName = product.target.href.substring(product.target.href.indexOf("/products/")+10)
						productLastViewedAt = alreadyViewedProducts[productName] || 0
						if(now-productLastViewedAt > oneDayMillis){
							alreadyViewedProducts[productName] = now;
							fetchAndLogProduct("/products/"+productName, 'shopify_product_viewed');
						}
						observer.unobserve(product.target);
					}
				}
				localStorage.setItem(viewedProductsStr, JSON.stringify(alreadyViewedProducts));

			}, { threshold: [1] });

			products = document.querySelectorAll("[href*='/products/']");
			for(const product of products){
				observer.observe(product);
			}
		}
	});
}());

function whenInitialized(callback) {
	var interval = 1000;
	window.setTimeout(function() {
		try{
			if (appboy && appboy.getUser()) {
				callback();
			} else {
				whenInitialized(callback);
			}
		}
		catch(err){
			whenInitialized(callback);
		}
	}, interval);
}

function fetchAndLogProduct(productPath, event){
	fetch(productPath+".js")
	  .then(response => response.json())
	  .then(data => {
		  console.log('Logging '+event+' for product '+productPath);
      //appboy.logCustomEvent(event, {
      //'id': data.id,
      //'title': data.title,
      //'price': data.price,
      //'vendor': data.vendor,
      //'images': data.images
      //});
    });
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

whenInitialized(function() {
	currentPath = window.location.pathname

	if(currentPath.startsWith("/products/")){      
		var alreadyClickedProducts = JSON.parse(localStorage.getItem('clicked_products') || "[]");

		productName = currentPath.substring(10)
		if (!alreadyClickedProducts.includes(productName)){
			localStorage.setItem('clicked_products', JSON.stringify(alreadyClickedProducts.concat(productName)));
			fetchAndLogProduct(currentPath, 'shopify_product_clicked');
		}      
	}

	if(currentPath.startsWith("/collections/")){
		var observer = new IntersectionObserver(function(products, observer) {
			var alreadyViewedProducts = JSON.parse(localStorage.getItem('viewed_products') || "[]");
			var tempViewedProducts = []
			for(var j = 0;j<products.length; j++){
				if(products[j].isIntersecting === true){
					productName = products[j].target.href.substring(products[j].target.href.indexOf("/products/")+10)
					if(!alreadyViewedProducts.includes(productName)){
						tempViewedProducts.push(productName);
						fetchAndLogProduct("/products/"+productName, 'shopify_product_viewed');
					}
					observer.unobserve(products[j].target);
				}
			}
			localStorage.setItem('viewed_products', JSON.stringify(alreadyViewedProducts.concat(tempViewedProducts)));

		}, { threshold: [1] });

		products = document.querySelectorAll("[href*='/products/']");
		for(var i=0;i<products.length;i++){
			observer.observe(products[i]);
		}
	}

	var cart_cookie = readCookie("cart");
	var cart_storage = localStorage.getItem('cart_token');
	if(cart_cookie != null && cart_cookie != cart_storage){
		localStorage.setItem('cart_token', cart_cookie);
		console.log('Logging event cart token with cookie '+cart_cookie)
		// appboy.getUser().setCustomUserAttribute('shopify_cart_token', cart_cookie);
	}
});

function getApiUrlAndApiKeyQueryParams(){
	const url = new URL([...document.getElementsByTagName("script")]
		.map(script => script.src)
		.find(src => src.includes("braze-cart-script"))
	);
	const urlSearch = new URLSearchParams(url.search)
	return Object.fromEntries(urlSearch.entries())
}

(function(ns, fetch){
	if(typeof fetch !== 'function') return;
  
  ns.fetch = function() {
  	if(arguments[0] == "/cart.js"){
	    fetch.apply(this, arguments).then(response => response.json()).then(data => { 
	    	if(data["item_count"] > 0){
	  			const cart_cookie = data["token"];
				const cart_storage = localStorage.getItem('cart_token');
				const customer_id = typeof ShopifyAnalytics != "undefined" ? ShopifyAnalytics.meta.page.customerId : null // should be sending device id instead so we have cart_token->device_id
				if(cart_cookie != null && cart_cookie != cart_storage && customer_id){
					localStorage.setItem('cart_token', cart_cookie);
					const queryParams = getApiUrlAndApiKeyQueryParams()
					fetch(
						queryParams["api_url"]+"/ecommerce/shopify/cart_update?cart_token="+cart_cookie+"&customer_id="+customer_id+"&api_key="+queryParams["api_key"]+"&shop="+queryParams["shop"], 
						{method: 'POST'}
					);
				}
	  		}
	    });
  	}
    
    return fetch.apply(this, arguments);;
  }
  
}(window, window.fetch));
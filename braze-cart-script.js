(function(ns, fetch){
	if(typeof fetch !== 'function') return;

	function getApiUrlAndApiKeyQueryParams(){
		const url = new URL([...document.getElementsByTagName("script")]
			.map(script => script.src)
			.find(src => src.includes("braze-cart-script"))
		);
		const urlSearch = new URLSearchParams(url.search)
		return Object.fromEntries(urlSearch.entries())
	}
  
  	ns.fetch = function() {
	  	if(arguments[0] == "/cart.js"){
		    fetch.apply(this, arguments).then(response => response.json()).then(data => { 
		    	if(data["item_count"] > 0){
		  			const cart_cookie = data["token"];
					const cart_storage = localStorage.getItem('cart_token');
					appboy.getDeviceId(function(device_id) {
   						if(cart_cookie != null && cart_cookie != cart_storage){
							localStorage.setItem('cart_token', cart_cookie);
							const queryParams = getApiUrlAndApiKeyQueryParams()
							fetch(
								'https://'+queryParams["sdk_url"]+`/api/v3/shopify/cart_update?cart_token=${cart_cookie}&device_id=${device_id}&api_key=${queryParams["api_key"]}&shop=${queryParams["shop"]}`, 
								{method: 'POST'}
							);
						}
					});					
		  		}
		    });
	  	}
	    return fetch.apply(this, arguments);;
  	}	
}(window, window.fetch));

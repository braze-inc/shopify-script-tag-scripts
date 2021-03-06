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
  
  	ns.fetch = async function() {
  		const response = await fetch.apply(this, arguments);
	  	if(arguments[0] == "/cart.js"){
		    response.clone().json().then(data => { 
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
	  	else if (arguments[0] == "/cart/add"){
	  		const cart_cookie = readCookie("cart");
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
	    return response;
  	}	
}(window, window.fetch));

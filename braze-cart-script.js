function readCookie(name) {
	const nameEQ = name + "=";
	const ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function getApiUrlAndApiKeyQueryParams(){
	const url = new URL([...document.getElementsByTagName("script")]
		.map(script => script.src)
		.find(src => src.includes("braze-cart-script"))
	);
	const urlSearch = new URLSearchParams(url.search)
	return Object.fromEntries(urlSearch.entries())
}

const cart_cookie = readCookie("cart");
const cart_storage = localStorage.getItem('cart_token');
if (typeof ShopifyAnalytics != "undefined") {
	const customer_id = ShopifyAnalytics.meta.page.customerId;
}
else{
	const customer_id = null;
}
if(cart_cookie != null && cart_cookie != cart_storage && customer_id){
	localStorage.setItem('cart_token', cart_cookie);
	const queryParams = getApiUrlAndApiKeyQueryParams()
	fetch(queryParams["api_url"]+'/ecommerce/shopify/cart_update?cart_token=${cart_cookie}&customer_id=${customer_id}&api_key=${queryParams["api_key"]}'+, "POST")
}

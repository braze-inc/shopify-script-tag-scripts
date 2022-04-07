(function(){
	if(!window.appboy){
		+function(a,p,P,b,y){a.appboy={};a.appboyQueue=[];for(var s="DeviceProperties Card Card.prototype.dismissCard Card.prototype.removeAllSubscriptions Card.prototype.removeSubscription Card.prototype.subscribeToClickedEvent Card.prototype.subscribeToDismissedEvent Banner CaptionedImage ClassicCard ControlCard ContentCards ContentCards.prototype.getUnviewedCardCount Feed Feed.prototype.getUnreadCardCount ControlMessage InAppMessage InAppMessage.SlideFrom InAppMessage.ClickAction InAppMessage.DismissType InAppMessage.OpenTarget InAppMessage.ImageStyle InAppMessage.Orientation InAppMessage.TextAlignment InAppMessage.CropType InAppMessage.prototype.closeMessage InAppMessage.prototype.removeAllSubscriptions InAppMessage.prototype.removeSubscription InAppMessage.prototype.subscribeToClickedEvent InAppMessage.prototype.subscribeToDismissedEvent InAppMessage.fromJson FullScreenMessage ModalMessage HtmlMessage SlideUpMessage User User.Genders User.NotificationSubscriptionTypes User.prototype.addAlias User.prototype.addToCustomAttributeArray User.prototype.addToSubscriptionGroup User.prototype.getUserId User.prototype.incrementCustomUserAttribute User.prototype.removeFromCustomAttributeArray User.prototype.removeFromSubscriptionGroup User.prototype.setAvatarImageUrl User.prototype.setCountry User.prototype.setCustomLocationAttribute User.prototype.setCustomUserAttribute User.prototype.setDateOfBirth User.prototype.setEmail User.prototype.setEmailNotificationSubscriptionType User.prototype.setFirstName User.prototype.setGender User.prototype.setHomeCity User.prototype.setLanguage User.prototype.setLastKnownLocation User.prototype.setLastName User.prototype.setPhoneNumber User.prototype.setPushNotificationSubscriptionType InAppMessageButton InAppMessageButton.prototype.removeAllSubscriptions InAppMessageButton.prototype.removeSubscription InAppMessageButton.prototype.subscribeToClickedEvent display display.automaticallyShowNewInAppMessages display.destroyFeed display.hideContentCards display.showContentCards display.showFeed display.showInAppMessage display.toggleContentCards display.toggleFeed changeUser destroy getDeviceId initialize isPushBlocked isPushGranted isPushPermissionGranted isPushSupported logCardClick logCardDismissal logCardImpressions logContentCardsDisplayed logCustomEvent logFeedDisplayed logInAppMessageButtonClick logInAppMessageClick logInAppMessageHtmlClick logInAppMessageImpression logPurchase openSession registerAppboyPushMessages removeAllSubscriptions removeSubscription requestContentCardsRefresh requestFeedRefresh requestImmediateDataFlush resumeWebTracking setLogger setSdkAuthenticationSignature stopWebTracking subscribeToContentCardsUpdates subscribeToFeedUpdates subscribeToInAppMessage subscribeToNewInAppMessages subscribeToSdkAuthenticationFailures toggleAppboyLogging trackLocation unregisterAppboyPushMessages wipeData".split(" "),i=0;i<s.length;i++){for(var m=s[i],k=a.appboy,l=m.split("."),j=0;j<l.length-1;j++)k=k[l[j]];k[l[j]]=(new Function("return function "+m.replace(/\./g,"_")+"(){window.appboyQueue.push(arguments); return true}"))()}window.appboy.getCachedContentCards=function(){return new window.appboy.ContentCards};window.appboy.getCachedFeed=function(){return new window.appboy.Feed};window.appboy.getUser=function(){return new window.appboy.User};(y=p.createElement(P)).type='text/javascript';
		    y.src='https://js.appboycdn.com/web-sdk/3.5/appboy.min.js';
		    y.async=1;(b=p.getElementsByTagName(P)[0]).parentNode.insertBefore(y,b)
		  }(window,document,'script');
		const url = new URL([...document.getElementsByTagName("script")]
				.map(script => script.src)
				.find(src => src.includes("braze-web-sdk-script.js"))
			);
		const urlSearch = new URLSearchParams(url.search)
		const queryParams = Object.fromEntries(urlSearch.entries())
		appboy.initialize(
			queryParams["api_key"],
			{
				baseUrl: queryParams["sdk_url"], 
				enableHtmlInAppMessages:queryParams["in_browser_msgs"] == "true",
				enableLogging: true
			}
		);

		if(queryParams["in_browser_msgs"] == "true"){
			appboy.display.automaticallyShowNewInAppMessages();
		}
		
		if(queryParams["content_cards"] == "true") {
			console.log("SUBSCRIBING TO CONTENT CARD FEED???");
			appboy.subscribeToContentCardsUpdates(function(updates) {
				const cards = updates.cards;
				console.log("Content cards:");
				console.table(cards);

				const containerElement = document.getElementById("powContainer");
				while(containerElement.firstChild) {
					containerElement.removeChild(containerElement.firstChild);
				}

				if (cards && cards.length) {
					cards.forEach((card, index) => {
						var cardDiv = document.createElement("div");
						if (index == 0) {
							cardDiv.class = "item active";
						} else {
							cardDiv.class = "item";
						}

						var cardLink = document.createElement("a");
						cardLink.href = card.url;
						cardLink.title = card.linkText;
						cardDiv.appendChild(cardLink);

						var cardImage = document.createElement("img");
						cardImage.class = "carousel-panel";
						cardImage.src = card.imageUrl;
						cardLink.appendChild(cardImage);

						var cardCaption = document.createElement("div");
						cardCaption.class = "carousel-caption";
						cardLink.appendChild(cardCaption);

						var cardTitle = document.createElement("h2");
						cardTitle.innerHTML = card.title;
						cardCaption.appendChild(cardTitle);

						var cardText = document.createElement("span");
						cardText.innerHTML = card.description;
						cardCaption.appendChild(cardText);

						containerElement.appendChild(cardDiv);
					});
				}
			});
			appboy.requestContentCardsRefresh();
		} else {
			console.log("ZERO CONTENT CARD FEED");
		}
		
		appboy.addSdkMetadata([ appboy.BrazeSdkMetadata.CDN ]);
		appboy.openSession();

	};
}());

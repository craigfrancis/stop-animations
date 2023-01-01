
// Icon from: http://www.iconspedia.com/icon/stop-8104.html

;(function(document, window, undefined) {

	'use strict';

	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

			if (request.action === 'screenshot_request') {
				chrome.tabs.captureVisibleTab(null, {'format': 'png'}, function(screenshot_url) {
					chrome.tabs.sendRequest(sender.tab.id, {
							'action': 'screenshot_response',
							'screenshot_id': request.screenshot_id,
							'screenshot_url': screenshot_url
						});
				});
			}

			sendResponse(null);

		});

})(document, window);

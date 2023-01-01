
// Icon from: http://www.iconspedia.com/icon/stop-8104.html

;(function(document, window, undefined) {

	'use strict';

	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

			if (request.action === 'screenShotRequest') {
				chrome.tabs.captureVisibleTab(null, {'format': 'png'}, function(screenShotUrl) {
					chrome.tabs.sendRequest(sender.tab.id, {
							'action': 'screenShotResponse',
							'screenShotId': request.screenShotId,
							'screenShotUrl': screenShotUrl
						});
				});
			}

			sendResponse(null);

		});

})(document, window);

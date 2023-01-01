
// Icon from: http://www.iconspedia.com/icon/stop-8104.html

;(function(undefined) {

	'use strict';

	function send_screenshot(tab_id, screenshot_id) {

		chrome.tabs.captureVisibleTab(null, {'format': 'png'}, function(screenshot_url) {

				chrome.tabs.sendMessage(tab_id, {
						'action': 'screenshot_response',
						'screenshot_id': screenshot_id,
						'screenshot_url': screenshot_url
					});

			});

	}

	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

		if (sender.id != chrome.runtime.id) {
			return;
		}

		if (message.action === 'screenshot_request') {

			send_screenshot(sender.tab.id, message.screenshot_id);

		}

	});

})();

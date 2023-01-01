
// Icon from: http://www.iconspedia.com/icon/stop-8104.html

;(function(undefined) {

	'use strict';

	function screenshot_send(tab_id, screenshot_id) {

		chrome.tabs.captureVisibleTab(null, {'format': 'png'}, function(screenshot_url) {

				chrome.tabs.sendMessage(tab_id, {
						'action': 'screenshot_response',
						'screenshot_id': screenshot_id,
						'screenshot_url': screenshot_url
					});

			});

	}

	function shortcut_check(tab_id) {

		if (typeof chrome.commands.getAll !== 'function') {
			return; // https://developer.chrome.com/docs/extensions/reference/commands/#method-getAll "Pending", "This is coming soon and not yet in a stable release of Chrome"?
		}

		chrome.commands.getAll(function(commands) {

				for (var k = (commands.length - 1); k >= 0; k--) {
					if (commands[k]['name'] == 'stop-animations' && commands[k]['shortcut'] !== '') {

						chrome.tabs.sendMessage(tab_id, {
								'action': 'screenshot_shortcut_set',
							});

					}
				}

			});

	}

	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

		if (sender.id != chrome.runtime.id) {
			return;
		}

		if (message.action === 'screenshot_request') {

			screenshot_send(sender.tab.id, message.screenshot_id);

		} else if (message.action === 'screenshot_shortcut_check') {

			shortcut_check(sender.tab.id);

		}

	});

	chrome.commands.onCommand.addListener(function(command, tab) {

		if (command == 'stop-animations') {
			screenshot_send(tab.id, -1);
		}

	});

})();


;(function(document, window, undefined) {

	'use strict';

	var screenshot_id = 0,
		screenshot_div = null,
		screenshot_img = null,
		screenshot_timeout = null;

	function remove_screenshot() {
		if (screenshot_div !== null) {

			// console.log('remove');

			screenshot_div.parentNode.removeChild(screenshot_div);

			screenshot_div = null;
			screenshot_img = null;

			window.removeEventListener('scroll', update_screenshot);
			window.removeEventListener('resize', update_screenshot);

		}
	}

	function update_screenshot() {

		// console.log('update');

		screenshot_div.style.display = 'none'; // Can't remove as this will loose the on-scroll event handler

		screenshot_id++;

		if (screenshot_timeout) {
			clearTimeout(screenshot_timeout);
		}
		screenshot_timeout = setTimeout(take_screenshot, (0.05*1000)); // slight delay (time in milliseconds, 1000 ms = 1 second)

	}

	function take_screenshot() {

		chrome.runtime.sendMessage({
				'action': 'screenshot_request',
				'screenshot_id': screenshot_id
			});

	}

	chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {

			if (sender.id != chrome.runtime.id) {
				return;
			}

			if (message.action === 'screenshot_response' && typeof message.screenshot_url !== 'undefined' && message.screenshot_url != 'undefined') {

				//--------------------------------------------------
				// Only show the latest

					if (message.screenshot_id == -1) {
						screenshot_id++;
						message.screenshot_id = screenshot_id;
					}

					if (message.screenshot_id != screenshot_id) {
						// console.log('Skipped (' + message.screenshot_id + ' != ' + screenshot_id + ')');
						return false;
					}

				//--------------------------------------------------
				// Cleanup

					remove_screenshot();

				//--------------------------------------------------
				// Events needing a new screenshot

					window.addEventListener('scroll', update_screenshot);
					window.addEventListener('resize', update_screenshot);

				//--------------------------------------------------
				// Window size:

						// Get the size of the window for the wrapper <div>.
						// This must match the viewable area, and not include the scroll bars.
						//
						// We allow the <img> to be the full size, as the image includes
						// the scroll bars, but are (mostly) hidden by the overflow:hidden <div>.

					var windowWidth = (document.compatMode !== 'BackCompat' ? document.documentElement.clientWidth : document.body.clientWidth);
					var windowHeight = (document.compatMode !== 'BackCompat' ? document.documentElement.clientHeight : document.body.clientHeight);

					var windowZoomed = (window.outerWidth != window.innerWidth);
					if (windowZoomed) {
						windowWidth -= 1;
						windowHeight -= 1;
					}

					if (windowHeight > window.innerHeight) { // innerHeight includes the scrollbar, so should always be bigger than the calculated windowHeight... but if it was effectively the document height (hence the compatMode check), we need to limit it.
						windowHeight = window.innerHeight;
					}

				//--------------------------------------------------
				// Image

					screenshot_img = document.createElement('img');
					screenshot_img.src = message.screenshot_url;
					screenshot_img.style.display = 'block';
					screenshot_img.style.maxWidth = 'none'; // Don't inherit from site css
					screenshot_img.width = window.innerWidth; // Width with scroll bars, can be wider than the <div> (important when zoomed)
					screenshot_img.onclick = remove_screenshot;

				//--------------------------------------------------
				// Wrapper div

					screenshot_div = document.createElement('div');
					screenshot_div.appendChild(screenshot_img);
					screenshot_div.style.position = 'absolute';
					screenshot_div.style.cursor = 'pointer';
					screenshot_div.style.top = window.scrollY + 'px'; // Was document.body.scrollTop (http://lists.w3.org/Archives/Public/www-style/2013Oct/0287.html)
					screenshot_div.style.left = window.scrollX + 'px';
					screenshot_div.style.width = windowWidth + 'px'; // Matt Saul is using `windowWidth + 17`, which might be a Windows Scroll bar issue? (https://github.com/intercision/stop-animations)
					screenshot_div.style.height = windowHeight + 'px';
					screenshot_div.style.zIndex = 2147483647; // Always on top
					screenshot_div.style.overflow = 'hidden';

				//--------------------------------------------------
				// Add to page

					var bodyRef = document.getElementsByTagName('body');
					if (bodyRef[0]) {
						bodyRef[0].appendChild(screenshot_div);
					}

			} else if (message.action === 'screenshot_shortcut_set') {

				document.removeEventListener('keydown', screenshot_key_press, true);

			}

		});

	function screenshot_key_press(e) {
		if (e.keyCode === 27 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
			if (screenshot_div !== null) {
				remove_screenshot();
			} else {
				take_screenshot();
			}
		}
	}

	document.addEventListener('keydown', screenshot_key_press, true);

	chrome.runtime.sendMessage({
			'action': 'screenshot_shortcut_check', // Add [esc] keydown event first, remove for those who have set a custom shortcut (takes ~40ms to check on a fast desktop).
		});

})(document, window);

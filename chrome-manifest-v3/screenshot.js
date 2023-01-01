
;(function(document, window, undefined) {

	'use strict';

	var screenShotId = 0,
		screenShotDiv = null,
		screenShotImg = null,
		screenShotTimeout = null;

	function removeScreenShot() {
		if (screenShotDiv !== null) {

			// console.log('remove');

			screenShotDiv.parentNode.removeChild(screenShotDiv);

			screenShotDiv = null;
			screenShotImg = null;

			window.removeEventListener('scroll', updateScreenShot);
			window.removeEventListener('resize', updateScreenShot);

		}
	}

	function updateScreenShot() {

		// console.log('update');

		screenShotDiv.style.display = 'none'; // Can't remove as this will loose the on-scroll event handler

		screenShotId++;

		if (screenShotTimeout) {
			clearTimeout(screenShotTimeout);
		}
		screenShotTimeout = setTimeout(takeScreenShot, (0.07*1000)); // slight delay

	}

	function takeScreenShot() {

		chrome.extension.sendRequest({
				'action': 'screenShotRequest',
				'screenShotId': screenShotId
			});

	}

	chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

			if (request.action === 'screenShotResponse' && typeof request.screenShotUrl !== 'undefined' && request.screenShotUrl != 'undefined') {

				//--------------------------------------------------
				// Only show the latest

					if (request.screenShotId != screenShotId) {
						// console.log('Skipped (' + request.screenShotId + ' != ' + screenShotId + ')');
						return false;
					}

				//--------------------------------------------------
				// Cleanup

					removeScreenShot();

				//--------------------------------------------------
				// Events needing a new screenshot

					window.addEventListener('scroll', updateScreenShot);
					window.addEventListener('resize', updateScreenShot);

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

					screenShotImg = document.createElement('img');
					screenShotImg.src = request.screenShotUrl;
					screenShotImg.style.display = 'block';
					screenShotImg.style.maxWidth = 'none'; // Don't inherit from site css
					screenShotImg.width = window.innerWidth; // Width with scroll bars, can be wider than the <div> (important when zoomed)
					screenShotImg.onclick = removeScreenShot;

				//--------------------------------------------------
				// Wrapper div

					screenShotDiv = document.createElement('div');
					screenShotDiv.appendChild(screenShotImg);
					screenShotDiv.style.position = 'absolute';
					screenShotDiv.style.cursor = 'pointer';
					screenShotDiv.style.top = window.scrollY + 'px'; // Was document.body.scrollTop (http://lists.w3.org/Archives/Public/www-style/2013Oct/0287.html)
					screenShotDiv.style.left = window.scrollX + 'px';
					screenShotDiv.style.width = windowWidth + 'px'; // Matt Saul is using `windowWidth + 17`, which might be a Windows Scroll bar issue? (https://github.com/intercision/stop-animations)
					screenShotDiv.style.height = windowHeight + 'px';
					screenShotDiv.style.zIndex = 2147483647; // Always on top
					screenShotDiv.style.overflow = 'hidden';

				//--------------------------------------------------
				// Add to page

					var bodyRef = document.getElementsByTagName('body');
					if (bodyRef[0]) {
						bodyRef[0].appendChild(screenShotDiv);
					}

			}

		});

	function screenShotKeyPress(e) {
		if (e.keyCode === 27 && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey) {
			if (screenShotDiv !== null) {
				removeScreenShot();
			} else {
				takeScreenShot();
			}
		}
	}

	document.addEventListener('keydown', screenShotKeyPress, true);

})(document, window);

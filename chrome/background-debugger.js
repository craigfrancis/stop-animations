
	//--------------------------------------------------
	// To use:
	//
	// 1) Update manifest.json to include the debugger permission:
	//
	//    "permissions": [ "tabs", "<all_urls>", "debugger" ]
	//
	// 2) Rename this file to background.js
	//
	//--------------------------------------------------
	//
	// https://cs.chromium.org/chromium/src/third_party/WebKit/Source/devtools/front_end/emulation/DeviceModeModel.js?l=636
	//
	//--------------------------------------------------

var debugging = false;

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {

		if (request.action === 'screenShotRequest') {

			if (debugging) {

				forceViewport(request, sender);

			} else {

				chrome.debugger.attach({tabId: sender.tab.id}, '1.0', function() {

						debugging = true;

						chrome.debugger.onEvent.addListener(function(source, method, params) {
								console.log(source);
								console.log(method);
								console.log(params);
							});

						forceViewport(request, sender);

					});

			}

		}

		sendResponse(null);

	});


function forceViewport(request, sender) {

	chrome.debugger.sendCommand({tabId: sender.tab.id}, 'Emulation.forceViewport', {
			'x': 0,
			'y': 0,
			'scale': 1
		}, function(result) {

			console.log(result);
			console.log(chrome.runtime.lastError);

			setTimeout(function() {
				setDeviceMetricsOverride(request, sender);
			}, 1000);

		});

}

function setDeviceMetricsOverride(request, sender) {

	chrome.debugger.sendCommand({tabId: sender.tab.id}, 'Emulation.setDeviceMetricsOverride', {
			'width': 0,
			'height': 0,
			'deviceScaleFactor': 1,
			'mobile': false,
			'fitWindow': false,
			'scale': 1
		}, function(result) {

			console.log(result);
			console.log(chrome.runtime.lastError);

			setTimeout(function() {
				setVisibleSize(request, sender);
			}, 1000);

		});

}

function setVisibleSize(request, sender) {

	chrome.debugger.sendCommand({tabId: sender.tab.id}, 'Emulation.setVisibleSize', {
			'width': 500,
			'height': 2000
		}, function(result) {

			console.log(result);
			console.log(chrome.runtime.lastError);

			setTimeout(function() {
				getScreenshot(request, sender);
			}, 1000);

		});

}

function getScreenshot(request, sender) {

	chrome.debugger.sendCommand({tabId: sender.tab.id}, 'Page.captureScreenshot', {
			'format': 'png',
			'fromSurface': false
		}, function(result) {

			console.log(result);
			console.log(chrome.runtime.lastError);

			// chrome.debugger.detach({tabId: sender.tab.id});
			// debugging = false;

			if (result.data) {

				chrome.tabs.sendRequest(sender.tab.id, {
						'action': 'screenShotResponse',
						'screenShotId': request.screenShotId,
						'screenShotUrl': 'data:image/png;base64,' + result.data
					});

				console.log('done');

			}

		});

}

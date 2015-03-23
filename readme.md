
# Stop Animation

Chrome extension to stop animations from distracting you while reading.

Just press the escape key [esc]... and press again to restore.

This stops everything from GIF, Flash, and even JavaScript.

Works by taking a screen shot and layering it over the page... unfortunately it can't do a full screen shot (see bug report 45209), so it re-updates when you scroll or resize the window.

https://chrome.google.com/webstore/detail/stop-animations/gemmknjnneiojfjelmgappppbaneikda

---

## Main issue

As Google Chrome cannot take a screen shot of the whole page, it creates a new one on scrolling or resizing.

This can create a jumpy/flickering type experience which is not ideal:

Feature request:
	https://code.google.com/p/chromium/issues/detail?id=469663

Was:
	https://code.google.com/p/chromium/issues/detail?id=45209

Deocumentation:
	http://code.google.com/chrome/extensions/tabs.html#method-captureVisibleTab

---

## Alternatives

It looks like there might be the ability to pause animated images (not JS, CSS, etc):

	http://code.google.com/p/chromium/issues/detail?id=3690

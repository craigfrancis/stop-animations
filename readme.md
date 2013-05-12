
# Stop Animation

Stops all on screen animations (Gif/Flash/JavaScript) when you press the [esc] key... until you or click or press [esc] again.

Works by taking a screen shot and layering it over the webpage, and will re-update when you scroll or resize the window (ideally future versions of Chrome will allow a full page screen shot, not just the visible part).

https://chrome.google.com/webstore/detail/stop-animations/gemmknjnneiojfjelmgappppbaneikda

---

## Main issue

As Google Chrome cannot take a screen shot of the whole page, it creates a new one on scrolling or resizing.

This can create a jumpy/flickering type experience which is not ideal:

https://code.google.com/p/chromium/issues/detail?id=45209

http://code.google.com/chrome/extensions/tabs.html#method-captureVisibleTab

---

## Alternative

http://code.google.com/p/chromium/issues/detail?id=3690

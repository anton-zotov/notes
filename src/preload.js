process.once('loaded', () => {
	global.electron = require('electron')
	electron.zoomFactor = 1.5;
	electron.webFrame.setZoomFactor(electron.zoomFactor);
	electron.changeZoomFactor = diff => {
		electron.zoomFactor += diff;
		electron.webFrame.setZoomFactor(electron.zoomFactor);
	};
})
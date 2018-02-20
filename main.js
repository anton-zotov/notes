const electron = require('electron')
const path = require('path')
const url = require('url')

const app = electron.app
const BrowserWindow = electron.BrowserWindow

let mainWindow;

function createWindow() {
	mainWindow = new BrowserWindow({ 
		width: 1200, height: 800,
		webPreferences: {
			preload: path.resolve(path.join(__dirname, '/src/preload.js'))
		}
	})

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}))

	// Open the DevTools.
	//mainWindow.webContents.openDevTools()

	mainWindow.on('closed', function () {
		mainWindow = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow()
	}
})
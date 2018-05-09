const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

let mainWindow;
global.sharedObject = { 
	text: '', 
	title: '',
	save() {
		
	}
};

let input_fn = process.argv[1];
//input_fn = 'C:/Users/Master/Desktop/Conspects/_learn.htm';
if (input_fn && input_fn != '.') {
	fs.readFile(input_fn, 'utf8', function (err, contents) {
		global.sharedObject = { text: contents, title: path.basename(input_fn) };
	});
}

function createWindow() {
	mainWindow = new BrowserWindow({
		width: 1200, height: 800,
		webPreferences: {
			preload: path.resolve(path.join(__dirname, '/src/preload.js'))
		},
		icon: path.join(__dirname, 'icon.png')
	});

	mainWindow.loadURL(url.format({
		pathname: path.join(__dirname, 'index.html'),
		protocol: 'file:',
		slashes: true
	}));

	// Open the DevTools.
	// mainWindow.webContents.openDevTools()

	mainWindow.on('closed', function () {
		mainWindow = null;
	});
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', function () {
	if (mainWindow === null) {
		createWindow();
	}
});
import saveAs from './FileSaver.js';
import highlight from './highlight';
import Quill from 'quill';
import { remote } from 'electron';

function saveToFile(text) {
	var blob = new Blob([text], { type: "text/plain;charset=utf-8" });
	saveAs(blob, current_fn || default_fn);
}

function loadFile() {
	const element = document.querySelector('#fileInput');
	element.onchange = (e) => {
		let file = element.files[0];
		element.value = "";
		current_fn = file.name;
		var reader = new FileReader();
		reader.onload = (e) => {
			let text = e.target.result;
			setPage({text, title: current_fn});
		};
		reader.readAsText(file);
	}
	element.click();
}

function bindClick(sel, fn) {
	let button = document.querySelector(sel);
	button.addEventListener('click', fn);
}

function isElectron() {
	if (typeof electron !== 'undefined' && electron)
		return true;
	return false;
}

function getGlobalObject() {
	return remote.getGlobal('sharedObject');
}

function getInitialTitle() {
	const title = isElectron() ? getGlobalObject().title : '';
	const default_title = 'New note';
	return title || default_title;
}

function getInitialText() {
	return getGlobalObject().text;
}

function getInitialPage() {
	let page = {
		text: '',
		title: ''
	};
	if (isElectron()) {
		page = {
			text: getInitialText(),
			title: getInitialTitle()
		};
	}
	return page;
}

function setTitle(title) {
	const postfix = ' - Notes';
	document.title = title + postfix;
}

function setHtml(html) {
	editor_input.innerHTML = html;
}

function setPage(page) {
	setHtml(page.text);
	setTitle(page.title);
}

let toolbar = [[{ header: [1, 2, false] }],
['bold', 'italic', 'underline'],
['image', 'link', 'code-block'],
[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
['load', 'save'],
['zoom-in', 'zoom-out']];

let options = {
	debug: 'error',
	modules: {
		toolbar,
		syntax: true
	},
	placeholder: 'Type something...',
	theme: 'snow'
};

const editorParent = document.querySelector('#editor');
const editor = new Quill(editorParent, options);
const editor_input = editorParent.querySelector('.ql-editor');
const default_fn = 'note.htm';
const initial_text = getInitialText();
let current_fn;

bindClick('.ql-save', () => {
	let rawText = editor_input.innerHTML;
	saveToFile(rawText);
});
bindClick('.ql-load', loadFile);
bindClick('.ql-zoom-in', () => electron.changeZoomFactor(0.1));
bindClick('.ql-zoom-out', () => electron.changeZoomFactor(-0.1));

document.querySelector('.ql-save').classList.add('far', 'fa-save');
document.querySelector('.ql-load').classList.add('fa', 'fa-upload');
document.querySelector('.ql-zoom-in').classList.add('fa', 'fa-search-plus');
document.querySelector('.ql-zoom-out').classList.add('fa', 'fa-search-minus');

setPage(getInitialPage());

if (!isElectron()) {
	document.querySelector('.ql-zoom-in').remove();
	document.querySelector('.ql-zoom-out').remove();
}
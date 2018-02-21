import saveAs from './FileSaver.js';
import highlight from './highlight';
import Quill from 'quill';
let Inline = Quill.import('blots/inline');
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
			setPage({ text, title: current_fn });
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
	return isElectron() ? getGlobalObject().title : '';
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
	const default_title = 'New note';
	title = title || default_title;
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
['image', 'link'],
[{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'align': [] }],
['code-word', 'code-block'],
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
const quill = new Quill(editorParent, options);
const editor_input = editorParent.querySelector('.ql-editor');
const default_fn = 'note.htm';
let current_fn;

bindClick('.ql-save', () => {
	let rawText = editor_input.innerHTML;
	saveToFile(rawText);
});
bindClick('.ql-load', loadFile);
bindClick('.ql-zoom-in', () => electron.changeZoomFactor(0.1));
bindClick('.ql-zoom-out', () => electron.changeZoomFactor(-0.1));
bindClick('.ql-code-word', () => {
	quill.format('codeword', true);
});

document.querySelector('.ql-save').classList.add('far', 'fa-save');
document.querySelector('.ql-load').classList.add('fa', 'fa-upload');
document.querySelector('.ql-zoom-in').classList.add('fa', 'fa-search-plus');
document.querySelector('.ql-zoom-out').classList.add('fa', 'fa-search-minus');
document.querySelector('.ql-code-word').classList.add('fa', 'fa-pen-square');

class CodeWordBlot extends Inline {
	static create(value) {
		const node = super.create(value);
		node.setAttribute('spellcheck', false);
		node.textContent = value.value;
		return node;
	}
}
CodeWordBlot.blotName = 'codeword';
CodeWordBlot.tagName = 'codeword';
Quill.register(CodeWordBlot);

setPage(getInitialPage());

if (!isElectron()) {
	document.querySelector('.ql-zoom-in').remove();
	document.querySelector('.ql-zoom-out').remove();
}
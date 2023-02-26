/** Class representing a native files attachment. */
class NativeFilesAttachment {

	/**
     * Create a NativeFilesAttachment instance.
     * @param {string} selector - CSS selector.
     * @param {Object} options - Object with options.
     */
	constructor(selector, options) {
		if (!selector || !options) return false;

		this.selector = selector;
		this.fileInputSelector = options.fileInputSelector;
		this.attachmentFilesSelector = options.attachmentFilesSelector;
		this.responseSelector = options.responseSelector;
		this.fileDelClass = options.fileDelClass;
		this.MAX_FILE_SIZE = options.maxFileSize || 10000000; //10mb
		this.files = options.files || [];
		this.window = window;
		this.document = document;
	}

	/** Initialization method. */
	init() {
		this.$appForm = this.document.querySelector(this.selector);
		if (this.$appForm == null) return false;

		this.$appFileInput = this.$appForm.querySelector(this.fileInputSelector);
		if (this.$appFileInput == null) return false;

		this.$appAttachmentFiles = this.$appForm.querySelector(this.attachmentFilesSelector);
		if (this.$appAttachmentFiles == null) return false;

		this.$appFileDel = this.$appForm.querySelectorAll(`.${this.fileDelClass}`);
		this.$appResponse = this.document.querySelector(this.responseSelector);

		this.renderFiles();

		this.$appFileInput.addEventListener('change', () => {
			const inputFiles = this.$appFileInput.files;
			if (this.files.length == 0) {
				for (let i = 0; i < inputFiles.length; i++) {
					this.addFile(inputFiles[i]);
				}
			} else {
				for (let i = 0; i < inputFiles.length; i++) {
					if (this.uniqueItemForName(inputFiles[i], this.files)) {
						this.addFile(inputFiles[i]);
					}
				}
			}
			this.renderFiles();
		}, false);

		this.$appForm.onsubmit = async (e) => {
		    e.preventDefault();
		    
			const {action,method} = e.target;
		    const formData = new FormData();
			formData.append('send', 'send');

			this.files.forEach(file => formData.append('upload_files[]', file));

			if (this.files.length > 0) {
			    let response = await fetch(action, {
			    	method: method,
			    	body: formData
			    });
			    const result = await response.json();
			    if (this.$appResponse != null) this.renderResponse(result);
			    else alert(result);
			    this.files = [];
			    this.renderFiles();
			} else alert('Files not uploaded');
		};
	}

	/**
     * Check unique item for property name.
     * @param {Object} item - Checked object.
     * @param {Array} arr - Array to check.
	 * @return {boolean}
     */
	uniqueItemForName(item, arr) {
		if (!Array.isArray(arr)) return false;
		for (let i = 0; i < arr.length; i++) {
			if (item.name == arr[i].name) return false;
		}
		return true;
	}

	/**
     * Add file object in array files.
     * @param {Object} file - File object.
     * @return {(void|boolean)}
     */
	addFile(file) {
		if (file.size < this.MAX_FILE_SIZE) this.files.push(file);
		else {
			alert('Download file size should not exceed 10 Mb');
			return false;
		}
	}

	/**
     * Removing a file from an array of files.
     * @param {integer} index - Number index.
     */
	delFile(index) {
		this.files.splice(index, 1);
		this.renderFiles();
	}

	/**
     * Render file method.
     * @param {Object} file - File object.
     * @param {number} index - Number index.
     */
	renderFile(file, index) {
		const $fileText = this.document.createElement('p');
		const $btn = this.document.createElement('button');
		$btn.setAttribute('type', 'button');
		$btn.setAttribute('class', this.fileDelClass);
		$btn.setAttribute('title', 'delete');
		$btn.dataset.index = index;
		$btn.innerText = 'Delete';
		$btn.onclick = () => {
			this.delFile(index);
		}
		const sizeMb = (file.size / 1e+6);
		$fileText.innerHTML = `<span>${file.name} (${sizeMb.toFixed(3)} Mb)</span>`;
		$fileText.appendChild($btn);
		this.$appAttachmentFiles.appendChild($fileText);
	}

	/** Render files method. */
	renderFiles() {
		if (this.files.length > 0) {
			this.$appAttachmentFiles.innerHTML = '';
			this.files.forEach((file, index) => this.renderFile(file, index));
		} else this.$appAttachmentFiles.innerHTML = '<p>No files attached</p>';
	}

	/** Render response method. */
	renderResponse(response) {
		this.$appResponse.innerHTML = JSON.stringify(response, false, 4);
	}
}

(new NativeFilesAttachment('.app__form', {
	fileInputSelector: '.app__file-input',
	attachmentFilesSelector: '.app__attachment-files',
	responseSelector: '.app__result',
	fileDelClass: 'app__file-del'
})).init();
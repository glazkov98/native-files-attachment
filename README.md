# Attaching files in form on vanilla js

## Example

To run make a git clone and run it on a local php server.

```
const nativeFilesAttachment = new NativeFilesAttachment('.app__form', {
	fileInputSelector: '.app__file-input',
	attachmentFilesSelector: '.app__attachment-files',
	responseSelector: '.app__result',
	fileDelClass: 'app__file-del'
});
nativeFilesAttachment.init();
```
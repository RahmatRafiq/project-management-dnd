import Dropzone from 'dropzone';
import 'dropzone/dist/dropzone.css';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

Dropzone.autoDiscover = false;

interface FileData {
  file_name: string;
  size: number;
  original_url: string;
}

interface DropzoneOptions {
  urlStore: string;
  urlDestroy: string;
  csrf: string;
  acceptedFiles: string;
  files?: FileData[];
  maxFiles: number;
  kind: string;
  maxFilesize: number;
}

const Dropzoner = (
  element: HTMLElement | null,
  key: string,
  { urlStore, urlDestroy, csrf, acceptedFiles, files, maxFiles, kind, maxFilesize }: DropzoneOptions
): Dropzone => {
  if (!element) throw new Error('Element not found');
  if (!urlStore) throw new Error('URL Store not found');
  if (!csrf) throw new Error('CSRF not found');
  if (!acceptedFiles) throw new Error('Accepted Files not found');
  if (!maxFiles) throw new Error('Max Files not found');
  if (!kind) throw new Error('Kind not found');
  if (!maxFilesize) throw new Error('Max Filesize not found');

  console.log('Dropzoner initialized');

  const myDropzone = new Dropzone(element, {
    url: urlStore,
    headers: { 'X-CSRF-TOKEN': csrf },
    acceptedFiles: acceptedFiles,
    maxFiles: maxFiles,
    maxFilesize: maxFilesize, 
    addRemoveLinks: true,
    init: function () {
      if (files) {
        files.forEach(file => {
          const mockFile = {
            name: file.file_name,
            size: file.size,
            accepted: true,
            kind,
            upload: {
              filename: file.file_name,
              size: file.size
            },
            dataURL: file.original_url
          } as unknown as Dropzone.DropzoneFile;

          this.emit('addedfile', mockFile);
          this.emit('thumbnail', mockFile, file.original_url);
          this.emit('complete', mockFile);

          const input = document.createElement('input');
          input.type = 'hidden';
          input.name = `${key}[]`;
          input.value = file.file_name;
          mockFile.previewElement?.appendChild(input);
        });
      }
    },
    success: function (file: Dropzone.DropzoneFile) {
      const response = file.xhr ? JSON.parse(file.xhr.responseText) : {};
      if (response && file.upload) {
        const upload = file.upload as unknown as { filename: string; size: number };
        upload.filename = response.name;
        upload.size = response.size;
      }
      console.log('Upload successful');
    },
    removedfile: function (file) {
      fetch(urlDestroy, {
        method: 'POST',
        headers: {
          'X-CSRF-TOKEN': csrf,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ filename: file.name })
      })
        .then(async res => {
          const text = await res.text();
          try {
            const data = JSON.parse(text);
            console.log('Parsed JSON:', data);
          } catch {
            console.error('Failed to parse JSON:', text);
          }
        })

        .then(data => console.log(data))
        .catch(error => console.error(error));

      file.previewElement?.parentNode?.removeChild(file.previewElement);
    },
    error: function (file, message: string | Error) {
      const errorMessage = message instanceof Error ? message.message : message;
      Toastify({
        text: errorMessage,
        className: 'error',
        duration: 5000
      }).showToast();
      file.previewElement?.parentNode?.removeChild(file.previewElement);
    },
  });

  return myDropzone;
};


export default Dropzoner;

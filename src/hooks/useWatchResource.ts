// const lastResourceVersion = ref();

// function streamUpdates() {
//   function onNewLine(buffer: string | string[], fn: { (chunk: any): void; (arg0: any): void; }) {
//     const newLineIndex = buffer.indexOf('\n');

//     if (newLineIndex === -1) {
//       return buffer;
//     }
//     const chunk = buffer.slice(0, buffer.indexOf('\n'));
//     const newBuffer = buffer.slice(buffer.indexOf('\n') + 1);

//     fn(chunk);

//     return onNewLine(newBuffer, fn);
//   }

//   fetch(`/apis/extension.datatunerx.io/v1beta1/namespaces/${namespace.value}/datasets?watch=1&resourceVersion=${lastResourceVersion.value}`, {
//     headers: {
//       Authorization: `Bearer ${process.env.VUE_APP_AUTH}`,
//     },
//   })
//     .then((response) => {
//       const stream = response.body.getReader();
//       const utf8Decoder = new TextDecoder('utf-8');
//       let buffer = '';

//       return stream.read().then(function processText({ done, value }) {
//         if (done) {
//           // eslint-disable-next-line no-console
//           console.log('Request terminated');

//           return;
//         }
//         buffer += utf8Decoder.decode(value);
//         buffer = onNewLine(buffer, (chunk) => {
//           if (chunk.trim().length === 0) {
//             return;
//           }
//           try {
//             const event = JSON.parse(chunk);

//             console.log(event.type, event.object.metadata.name);
//           } catch (error) {
//             console.log('Error while parsing', chunk, '\n', error);
//           }
//         });

//         return stream.read().then(processText);
//       });
//     })
//     .catch(() => {
//       console.log('Error! Retrying in 5 seconds...');
//       setTimeout(() => streamUpdates(), 5000);
//     });
// }

// fetch(`/apis/extension.datatunerx.io/v1beta1/namespaces/${namespace.value}/datasets`, {
//   headers: {
//     Authorization: `Bearer ${process.env.VUE_APP_AUTH}`,
//   },
// })
//   .then((response) => response.json())
//   .then((response) => {
//     lastResourceVersion.value = response.metadata.resourceVersion;
//   })
//   .then(() => streamUpdates());

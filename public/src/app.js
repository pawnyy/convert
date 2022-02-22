const { createFFmpeg } = require('@ffmpeg/ffmpeg');
// The log true is optional, shows ffmpeg logs in the console
const ffmpeg = createFFmpeg({ log: true });

const transcode = async ({ target: { files } }) => {
    console.log(files)
    if (!ffmpeg.isLoaded()) {
        await ffmpeg.load();
    }

    for (let file of files) {
        const name = file.name;
        // This loads up the ffmpeg.wasm files from a CDN
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer);
        ffmpeg.FS("writeFile", name, uint8Array);
        await ffmpeg.run('-i', name, 'test.mp3');
        const data = ffmpeg.FS('readFile', 'test.mp3');
        // const track = document.getElementById("track");
        // track.src = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }));
        let elem = document.createElement("a")
        elem.href = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }))
        elem.download = name.replace(name.substr(name.lastIndexOf('.')), '') + '.mp3'
        elem.innerText = name.replace(name.substr(name.lastIndexOf('.')), '') + '.mp3'
        document.body.appendChild(elem)
        document.body.appendChild(document.createElement('br'))
    }

}
const uploader = document.getElementById('uploader')
uploader.addEventListener('change', transcode);

const { createFFmpeg } = require('@ffmpeg/ffmpeg');
// The log true is optional, shows ffmpeg logs in the console
const ffmpeg = createFFmpeg({ log: true });
const button = document.getElementById('processBtn')

const process = async (files) => {
    console.log(files)
    button.disabled = true;
    if (!ffmpeg.isLoaded()) {
        let loading = document.createElement('a')
        loading.innerText = `Starting loading... ${files.length} files will be processed`
        document.body.appendChild(loading)
        await ffmpeg.load();
        loading.style.display = 'none'
    }

    for (let i = 1; i<=files.length; i++) {
        let file = files[i-1]
        const name = file.name;
        let dropdown = document.getElementById('formatDd');
        const format = dropdown.value;

        let elem = document.createElement('a')
        elem.innerText = `(${i}/${files.length}) Loading... ${name.replace(name.substr(name.lastIndexOf('.')), '')}.${format}`
        document.body.appendChild(elem)
        document.body.appendChild(document.createElement('br'))

        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer);
        ffmpeg.FS("writeFile", name, uint8Array);
        await ffmpeg.run('-i', name, 'test.'+format);
        const data = ffmpeg.FS('readFile', 'test.'+format);
        // const track = document.getElementById("track");
        // track.src = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }));
        elem.href = URL.createObjectURL(new Blob([data.buffer], { type: 'audio/mpeg' }))
        elem.download = name.replace(name.substr(name.lastIndexOf('.')), '') + '.'+format
        elem.innerText = name.replace(name.substr(name.lastIndexOf('.')), '') + '.'+format
    }
    button.disabled = false;
}

const uploader = document.getElementById('uploader')

button.onclick = async () =>{
    await process(uploader.files)
}



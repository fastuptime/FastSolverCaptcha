async function captcha(code) {
    const { createWorker } = require('tesseract.js');
    const worker = await createWorker();
    const jimp = require('jimp');

    let x = await jimp.read(`./cache/${code}.png`).then(async (img) => {
        img.color([{ apply: 'blue', params: [Math.floor(Math.random() * 100)] }]);
        img.color([{ apply: 'xor', params: [Math.floor(Math.random() * 100)] }]);
        img.contrast(0.1);
        img.posterize(0.5);

        img.color([{ apply: 'hue', params: [Math.floor(Math.random() * 100)] }]);
        img.color([{ apply: 'lighten', params: [Math.floor(Math.random() * 100)] }]);
        img.color([{ apply: 'xor', params: [Math.floor(Math.random() * 100)] }]);
        img.write(`./cache/${code}.png`);


        await worker.load();
        await worker.loadLanguage('eng');
        await worker.initialize('eng');

        await worker.setParameters({
            tessedit_char_whitelist: '0123456789',
        });

        await worker.setParameters({
            tessedit_char_blacklist: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
        });

        await worker.setParameters({
            tessedit_pageseg_mode: '6',
        });

        let { data: { text } } = await worker.recognize(`./cache/${code}.png`);
        text = text.replace(/[^0-9]/g, '');
        console.log('Captcha: ', text);
        await worker.terminate();

        return text;
    });

    return x;
}


module.exports = captcha;
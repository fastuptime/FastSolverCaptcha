const express = require('express');
const app = express();
const captcha = require('./captcha');

app.get('/solvercaptcha', async (req, res) => {
    try {
        const captchaCode = await captcha('captcha');
        if(captchaCode == ' ' || captchaCode == '' || captchaCode == null || captchaCode == undefined) return res.json({ code: 'error', error: 'Captcha çözülemedi' });
        res.json({
            code: captchaCode,
        });
    } catch (error) {
        res.json({
            code: 'error',
            error: error,
        });
    }
});


app.listen(3000, () => {
    console.log('API Açıldı');
});
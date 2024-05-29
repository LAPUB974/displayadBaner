const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
const PORT = process.env.PORT || 3000;

async function getScriptStyle() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Charger une page HTML avec le script
    const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head></head>
      <body>
        <ins class="aso-zone" data-zone="57989"></ins>
        <script data-cfasync="false" async="async" type="text/javascript" src="https://media.aso1.net/js/code.min.js"></script>
      </body>
    </html>
  `;

    await page.setContent(htmlContent, { waitUntil: 'networkidle0' });

    // Attendre que le script soit chargé
    await page.waitForSelector('script[src="https://media.aso1.net/js/code.min.js"]');

    // Récupérer le style du script
    const computedStyle = await page.evaluate(() => {
        const scriptElement = document.querySelector('script[src="https://media.aso1.net/js/code.min.js"]');
        if (scriptElement) {
            const style = window.getComputedStyle(scriptElement);
            return {
                display: style.display,
                // Ajoutez d'autres styles nécessaires ici
            };
        }
        return null;
    });

    await browser.close();
    return computedStyle;
}

app.get('/get-script-style', async (req, res) => {
    try {
        const style = await getScriptStyle();
        res.json(style);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

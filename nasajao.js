const nasajonURL = "https://pontoweb.nasajon.com.br/radix/";

const puppeteer = require('puppeteer');
const timeResolve = require('./timeResolve').default;

(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(nasajonURL);
    page.on('console', msg => {
        for (let i = 0; i < msg.args().length; ++i)
            console.log(`${i}: ${msg.args()[i]}`);
    });
    
    const inputUsername = await page.$("input[name=username]");
    await inputUsername.type(process.env.USEREMAIL || "user-email");

    const inputPassword = await page.$("input[name=password][type=password]");
    await inputPassword.type(process.env.USERPASSWORD || "user-password");

    const inputSubmit = await page.$("input[type=submit]");
    await inputSubmit.click();

    await page.waitForNavigation();

    await page.waitForSelector("#pendencias-table tbody tr");

    await page.evaluate(timeResolve);
    
    await page.screenshot({ path: 'example.png' });

    await browser.close();
})();
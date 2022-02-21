import { WebServer } from 'koapache';
import { Browser, Page, launch } from 'puppeteer-core';

const { npm_config_chrome } = process.env;

var server: string, browser: Browser, page: Page;

export async function bootServer() {
    if (server) return server;

    const { address, port } = await new WebServer({
        staticPath: 'test/dist/'
    }).workerHost();

    return (server = `http://${address}:${port}/`);
}

export async function getPage(path: string) {
    browser =
        browser ||
        (await launch({ executablePath: npm_config_chrome, slowMo: 200 }));

    page = page || (await browser.pages())[0];

    await page.goto(path);

    return page;
}

export async function expectPage(
    selector: string,
    content: string,
    title: string,
    path: string
) {
    expect(
        await page.$eval(selector, tag => [
            tag.textContent,
            document.title,
            window.location.hash
        ])
    ).toStrictEqual(expect.arrayContaining([content, title, path]));
}

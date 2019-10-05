import WebServer from 'koapache';
import { Browser, Page, launch } from 'puppeteer-core';

const { npm_config_chrome } = process.env;

var server: string, browser: Browser, page: Page;

export async function bootServer() {
    if (server) return server;

    const { address, port } = await new WebServer('test/dist/').workerHost();

    return (server = `http://${address}:${port}/`);
}

export async function getPage(path: string) {
    browser = browser || (await launch({ executablePath: npm_config_chrome }));

    page = page || (await browser.pages())[0];

    await page.goto(path);

    return page;
}

export async function expectPage(
    rootSelector: string,
    content: string,
    title: string,
    path: string
) {
    expect(
        await page.$eval(`${rootSelector} div`, tag => [
            tag.textContent,
            document.title,
            window.location.hash
        ])
    ).toStrictEqual(expect.arrayContaining([content, title, path]));
}

export function delay(seconds = 0.1) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

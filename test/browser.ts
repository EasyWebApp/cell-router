import WebServer from 'koapache';
import { Browser, Page, launch } from 'puppeteer-core';
import { join } from 'path';

export async function bootServer() {
    const server = new WebServer('test/dist/');

    const { address, port } = await server.workerHost();

    return `http://${address}:${port}/`;
}

const { npm_config_chrome } = process.env;

var browser: Browser, page: Page;

export async function getPage(path: string) {
    browser = browser || (await launch({ executablePath: npm_config_chrome }));

    page = page || (await browser.pages())[0];

    await page.goto(path);

    return page;
}

export function delay(seconds = 0.1) {
    return new Promise(resolve => setTimeout(resolve, seconds * 1000));
}

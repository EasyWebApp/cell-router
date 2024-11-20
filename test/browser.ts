import 'dotenv/config';

import { WebServer } from 'koapache';
import { launch, Browser, Page } from 'puppeteer-core';

const { CI, chrome, msedge, firefox } = process.env;

var server: string, browser: Browser, page: Page;

export async function bootServer() {
    if (server) return server;

    const { address, port } = await new WebServer({
        staticPath: 'docs/preview/'
    }).workerHost();

    return (server = `http://${address}:${port}/`);
}

export async function getPage(path: string) {
    browser ||= await launch({
        browser: chrome || msedge ? 'chrome' : 'firefox',
        executablePath: chrome || msedge || firefox,
        headless: !!CI,
        slowMo: 200
    });
    page ||= (await browser.pages())[0];

    await page.goto(path);

    return page;
}

export async function expectPage(
    selector: string,
    content: string,
    title: string,
    path: string
) {
    const result = await page.$eval(selector, tag => [
        tag.textContent,
        document.title,
        window.location.hash
    ]);
    expect(result).toEqual([content, title, path]);
}

import { Page } from 'puppeteer-core';
import { bootServer, getPage } from './browser';

var server: string, page: Page;

async function expectPage(content: string, title: string, path: string) {
    expect(
        await page.$eval('div', tag => [
            tag.textContent,
            document.title,
            window.location.hash
        ])
    ).toStrictEqual(expect.arrayContaining([content, title, path]));
}

describe('HTMLRouter', () => {
    beforeAll(async () => {
        server = await bootServer();

        page = await getPage(server);
    });

    it('should render Router component', async () => {
        expect(await page.$eval('page-router', tag => tag.innerHTML)).toBe(
            '<main><ul><li><a href="test">Test</a></li><li><a href="example">Example</a></li></ul><div></div></main>'
        );
    });

    it('should turn to a page after clicking a link', async () => {
        await page.click('li:first-child a');

        await expectPage('test', 'Test', '#test');

        await page.click('li:last-child a');

        await expectPage('example', 'Example', '#example');
    });

    it('should turn to a page after navigating', async () => {
        await page.goBack();

        await expectPage('test', 'Test', '#test');

        await page.goForward();

        await expectPage('example', 'Example', '#example');
    });

    it('should render a page based on Router path after reloading', async () => {
        await page.reload();

        await expectPage('example', 'Example', '#example');

        await page.goBack();

        await expectPage('test', 'Test', '#test');

        await page.goBack();

        await expectPage('', 'Cell Router', '');
    });
});

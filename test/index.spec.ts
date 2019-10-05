import { Page } from 'puppeteer-core';
import { bootServer, getPage, expectPage } from './browser';

var server: string, page: Page;

describe('Simple router', () => {
    beforeAll(async () => {
        server = await bootServer();

        page = await getPage(server);
    });

    it('should render Router component', async () => {
        expect(await page.$eval('simple-router', tag => tag.innerHTML)).toBe(
            '<main><ul><li><a href="test">Test</a></li><li><a href="example">Example</a></li></ul><div></div></main>'
        );
    });

    it('should turn to a page after clicking a link', async () => {
        await page.click('simple-router li:first-child a');

        await expectPage('simple-router', 'test', 'Test', '#test');

        await page.click('simple-router li:last-child a');

        await expectPage('simple-router', 'example', 'Example', '#example');
    });

    it('should turn to a page after navigating', async () => {
        await page.goBack();

        await expectPage('simple-router', 'test', 'Test', '#test');

        await page.goForward();

        await expectPage('simple-router', 'example', 'Example', '#example');
    });

    it('should render a page based on Router path after reloading', async () => {
        await page.reload();

        await expectPage('simple-router', 'example', 'Example', '#example');

        await page.goBack();

        await expectPage('simple-router', 'test', 'Test', '#test');

        await page.goBack();

        await expectPage('simple-router', '', 'Cell Router', '');
    });
});

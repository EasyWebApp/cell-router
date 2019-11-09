import { Page } from 'puppeteer-core';
import { bootServer, getPage, expectPage } from './browser';

var server: string, page: Page;

describe('Sample router', () => {
    beforeAll(async () => {
        server = await bootServer();

        page = await getPage(server);
    });

    it('should render Sub Router component', async () => {
        await page.click('top-router li:last-child a');

        expect(await page.$eval('sub-router', tag => tag.innerHTML)).toBe(
            '<main><ul><li><a href="sample">Sample</a></li><li><a href="temp">Temp</a></li></ul><div></div></main>'
        );
    });

    it('should turn to a Sub page after clicking a Nested link', async () => {
        await page.click('sub-router li:first-child a');

        await expectPage('sub-router', 'sample', 'Sample', '#example#sample');

        await page.click('sub-router li:last-child a');

        await expectPage('sub-router', 'temp', 'Temp', '#example#temp');
    });

    it('should turn to a Sub page after Nested navigating', async () => {
        await page.goBack();

        await expectPage('sub-router', 'sample', 'Sample', '#example#sample');
        /*
        await page.goBack();
        await page.goBack();

        await expectPage('top-router', 'test', 'Test', '#test');
*/
    });
    /*
    it('should render a Sub page based on Router path after reloading', async () => {
        await page.reload();

        await expectPage('top-router', 'test', 'Test', '#test');

        await page.goForward();
        await page.goForward();

        await expectPage('sub-router', 'sample', 'Sample', '#example#sample');

        await page.goForward();

        await expectPage('sub-router', 'temp', 'Temp', '#example#temp');
    });
*/
});

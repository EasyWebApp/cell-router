import { Page } from 'puppeteer-core';
import { bootServer, getPage, expectPage } from './browser';

var server: string, page: Page;

describe('Simple router', () => {
    beforeAll(async () => {
        server = await bootServer();

        page = await getPage(server);
    });

    it('should render Router component', async () => {
        expect(await page.$eval('nested-router', tag => tag.innerHTML)).toBe(
            '<main><ul><li><a href="simple">Simple</a></li><li><a href="nested">Nested</a></li></ul><div></div></main>'
        );
    });

    it('should turn to a page after clicking a link', async () => {
        await page.click('nested-router li:first-child a');

        await expectPage('nested-router', 'simple', 'Simple', '#simple');

        await page.click('nested-router li:last-child a');

        await expectPage(
            'nested-router simple-router',
            '',
            'Nested',
            '#nested'
        );
    });

    it('should turn to a Sub page after clicking a Nested link', async () => {
        await page.click('nested-router simple-router li:first-child a');

        await expectPage(
            'nested-router simple-router',
            'test',
            'Test',
            '#nested#test'
        );

        await page.click('nested-router simple-router li:last-child a');

        await expectPage(
            'nested-router simple-router',
            'example',
            'Example',
            '#nested#example'
        );
    });

    it('should turn to a Sub page after Nested navigating', async () => {
        await page.goBack();

        await expectPage(
            'nested-router simple-router',
            'test',
            'Test',
            '#nested#test'
        );

        await page.goBack();
        await page.goBack();

        await expectPage('nested-router', 'simple', 'Simple', '#simple');
    });

    it('should render a Sub page based on Router path after reloading', async () => {
        await page.reload();

        await expectPage('nested-router', 'simple', 'Simple', '#simple');

        await page.goForward();
        await page.goForward();

        await expectPage(
            'nested-router simple-router',
            'test',
            'Test',
            '#nested#test'
        );

        await page.goForward();

        await expectPage(
            'nested-router simple-router',
            'example',
            'Example',
            '#nested#example'
        );
    });
});

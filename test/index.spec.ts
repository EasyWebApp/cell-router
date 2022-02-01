import type { Page } from 'puppeteer-core';
import { bootServer, getPage, expectPage } from './browser';

var server: string, page: Page;

describe('Top router', () => {
    beforeAll(async () => {
        server = await bootServer();

        page = await getPage(server);
    });

    it('should render Router component', async () => {
        expect(await page.$eval('body', tag => tag.innerHTML.trim())).toBe(
            '<nav>' +
                '<a href="test?a=1">Test</a>' +
                '<a href="example?b=2">Example</a>' +
                '</nav>' +
                '<cell-router class="router" page-class="page" style="display: block;" start-class="start" end-class="end" path="">' +
                '<div><div class="page"></div></div>' +
                '</cell-router>'
        );
    });

    it('should turn to a page after clicking a link', async () => {
        await page.click('nav a:first-child');

        await expectPage(
            'cell-router',
            'Path: test' + 'Data: {"a":1}',
            'Test',
            '#test?a=1'
        );

        await page.click('nav a:last-child');

        await expectPage(
            'cell-router',
            'Path: example' + 'Data: {"b":2}',
            'Example',
            '#example?b=2'
        );
    });

    it('should turn to a page after navigating', async () => {
        await page.goBack();

        await expectPage(
            'cell-router',
            'Path: test' + 'Data: {"a":1}',
            'Test',
            '#test?a=1'
        );

        await page.goForward();

        await expectPage(
            'cell-router',
            'Path: example' + 'Data: {"b":2}',
            'Example',
            '#example?b=2'
        );
    });

    it('should render a page based on Router path after reloading', async () => {
        await page.reload();

        await expectPage(
            'cell-router',
            'Path: example' + 'Data: {"b":2}',
            'Example',
            '#example?b=2'
        );

        await page.goBack();

        await expectPage(
            'cell-router',
            'Path: test' + 'Data: {"a":1}',
            'Test',
            '#test?a=1'
        );

        await page.goBack();

        await expectPage('cell-router', '', 'Cell Router', '');
    });

    it('should render a page based on Changed Hash', async () => {
        await page.evaluate(() => (location.hash = '#test?a=1'));

        await expectPage(
            'cell-router',
            'Path: test' + 'Data: {"a":1}',
            'Cell Router',
            '#test?a=1'
        );
    });
});

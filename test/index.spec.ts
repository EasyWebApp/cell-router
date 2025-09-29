import { sleep } from 'web-utility';
import type { Page } from 'puppeteer-core';
import { bootServer, getPage, expectPage } from './browser';

var server: string, page: Page;

describe('Top router', () => {
    beforeAll(async () => {
        server = await bootServer();

        page = await getPage(server);
    });

    it('should render Route components', async () => {
        expect(await page.$eval('body', tag => tag.innerHTML.trim())).toBe(
            '<nav><a href="#list/1">List page</a>' +
                '<a href="#detail/2?edit=true">Detail page</a>' +
                '<a href="#dynamic/3?edit=true">Dynamic page</a>' +
                '<a href="#async/4?edit=true">Async page</a>' +
                '<a href="#not-found">404 page</a></nav>' +
                '<cell-router class="router">' +
                '<h1>Home</h1>' +
                '</cell-router>'
        );
    });

    it('should turn to a page after clicking a link', async () => {
        await page.click('nav a:nth-child(1)');

        await expectPage(
            'cell-router',
            'Path: #list/1' + 'Data: {"id":"1"}',
            'List page',
            '#list/1'
        );

        await page.click('nav a:nth-child(2)');

        await expectPage(
            'cell-router',
            'Path: #detail/2?edit=true' + 'Data: {"id":"2","edit":true}',
            'Detail page',
            '#detail/2?edit=true'
        );
    });

    it('should turn to a page after navigating', async () => {
        await page.goBack();

        await expectPage(
            'cell-router',
            'Path: #list/1' + 'Data: {"id":"1"}',
            'List page',
            '#list/1'
        );

        await page.goForward();

        await expectPage(
            'cell-router',
            'Path: #detail/2?edit=true' + 'Data: {"id":"2","edit":true}',
            'Detail page',
            '#detail/2?edit=true'
        );
    });

    it('should render a page based on Router path after reloading', async () => {
        await page.reload();

        await expectPage(
            'cell-router',
            'Path: #detail/2?edit=true' + 'Data: {"id":"2","edit":true}',
            'Detail page',
            '#detail/2?edit=true'
        );

        await page.goBack();

        await expectPage(
            'cell-router',
            'Path: #list/1' + 'Data: {"id":"1"}',
            'List page',
            '#list/1'
        );

        await page.goBack();

        await expectPage('cell-router', 'Home', 'Cell Router', '');
    });

    it('should render a page based on Changed Hash', async () => {
        await page.evaluate(() => (location.hash = '#list/1'));

        await expectPage(
            'cell-router',
            'Path: #list/1' + 'Data: {"id":"1"}',
            'List page',
            '#list/1'
        );
    });

    it('should load a Dynamic Page component', async () => {
        await page.click('nav a:nth-child(3)');

        await sleep();

        await expectPage('cell-router h1', 'Dynamic', 'Dynamic page', '#dynamic/3?edit=true');
    });

    it('should load an Async Page component', async () => {
        await page.click('nav a:nth-child(4)');

        await sleep();

        await expectPage('cell-router h1', 'Async', 'Async page', '#async/4?edit=true');
    });

    it('should show 404 page for not matched route', async () => {
        await page.click('nav a:nth-child(5)');

        await expectPage('cell-router h1', '404 Not Found', '404 page', '#not-found');
    });
});

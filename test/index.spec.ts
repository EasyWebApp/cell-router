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
                '<a href="#async/3?edit=true">Async page</a></nav>' +
                '<main class="router">' +
                '<cell-route path="#"><div>Home Page</div></cell-route>' +
                '<cell-route path="#list/:id"></cell-route>' +
                '<cell-route path="#detail/:id"></cell-route>' +
                '<cell-route path="#async/:id"></cell-route>' +
                '</main>'
        );
    });

    it('should turn to a page after clicking a link', async () => {
        await page.click('nav a:nth-child(1)');

        await expectPage(
            'cell-route:nth-child(2)',
            'Path: #list/1' + 'Data: {"id":"1"}',
            'List page',
            '#list/1'
        );

        await page.click('nav a:nth-child(2)');

        await expectPage(
            'cell-route:nth-child(3)',
            'Path: #detail/2?edit=true' + 'Data: {"id":"2","edit":true}',
            'Detail page',
            '#detail/2?edit=true'
        );
    });

    it('should turn to a page after navigating', async () => {
        await page.goBack();

        await expectPage(
            'cell-route:nth-child(2)',
            'Path: #list/1' + 'Data: {"id":"1"}',
            'List page',
            '#list/1'
        );

        await page.goForward();

        await expectPage(
            'cell-route:nth-child(3)',
            'Path: #detail/2?edit=true' + 'Data: {"id":"2","edit":true}',
            'Detail page',
            '#detail/2?edit=true'
        );
    });

    it('should render a page based on Router path after reloading', async () => {
        await page.reload();

        await expectPage(
            'cell-route:nth-child(3)',
            'Path: #detail/2?edit=true' + 'Data: {"id":"2","edit":true}',
            'Detail page',
            '#detail/2?edit=true'
        );

        await page.goBack();

        await expectPage(
            'cell-route:nth-child(2)',
            'Path: #list/1' + 'Data: {"id":"1"}',
            'List page',
            '#list/1'
        );

        await page.goBack();

        await expectPage('cell-route', 'Home Page', 'Cell Router', '');
    });

    it('should render a page based on Changed Hash', async () => {
        await page.evaluate(() => (location.hash = '#list/1'));

        await expectPage(
            'cell-route:nth-child(2)',
            'Path: #list/1' + 'Data: {"id":"1"}',
            'List page',
            '#list/1'
        );
    });

    it('should load an Async Page component', async () => {
        await page.click('nav a:nth-child(3)');

        await expectPage(
            'cell-route:nth-child(4) h1',
            'Async',
            'Async page',
            '#async/3?edit=true'
        );
    });
});

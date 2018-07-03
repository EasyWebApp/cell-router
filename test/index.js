import PuppeteerBrowser from 'puppeteer-browser';

var page;

function waitForNav() {

    return  page.waitForSelector('cell-router',  router => (! router.loading));
}

function firstPage() {

    return  page.$eval('cell-router',  router => {

        const stack = router.stack;

        return [
            stack[0].nodeType, stack.container.innerHTML, stack.last, stack.length
        ];
    }).should.be.fulfilledWith([11, '<page-hello></page-hello>', 1, 2]);
}


/**
 * @test {PageStack}
 */
describe('Page history',  () => {

    before(async () => page = await PuppeteerBrowser.getPage('', 'test/'));

    /**
     * @test {PageStack#constructor}
     */
    it('Boot SPA',  () => page.evaluate(() => [
        history.length, document.title, history.state
    ]).should.be.fulfilledWith([
        2,  'Demo',  {path: '', title: 'Demo', index: 0}
    ]));

    /**
     * @test {PageStack#cache}
     * @test {PageStack#record}
     * @test {PageStack#push}
     */
    it('Go to a new page',  async () => {

        await page.click('nav > a');

        await waitForNav();

        (await page.evaluate(() => [
            history.length, location.pathname, document.title, history.state
        ])).should.be.eql([
            3, '/test/test', 'Test', {
                tag: 'page-hello',  path: 'test',  title: 'Test',  index: 1
            }
        ]);

        await firstPage();
    });

    /**
     * @test {PageStack#pop}
     */
    it('Back to a old page',  async () => {

        await page.goBack();

        (await page.$eval('cell-router',  router => {

            const stack = router.stack;

            const state = stack.lastState;

            delete state.tag;

            return [
                stack.last, state,
                stack[1].nodeType, stack.container.innerHTML.trim()
            ];
        })).should.be.eql([
            0,  {path: '', title: 'Demo', index: 0},  11,  'Loading...'
        ]);
    });

    /**
     * @test {PageStack#pop}
     */
    it('Reload SPA',  async () => {

        await page.reload();

        await page.goForward();

        await waitForNav();

        await firstPage();
    });
});

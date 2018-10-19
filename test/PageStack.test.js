import PuppeteerBrowser from 'puppeteer-browser';

var page;

function consoleData() {

    return  new Promise(
        resolve  =>  page.on('console',  message => resolve( message.text() ))
    );
}

function waitForNav() {

    return  page.waitForSelector('cell-router',  router => (! router.loading));
}

function firstPage() {

    return  page.$eval('cell-router',  router => {

        const stack = router.stack;

        return [
            stack[0].nodeType, stack.length, stack.last,
            stack.container.children[0].constructor.name
        ];
    }).should.be.fulfilledWith([11, 2, 1, 'PageHello']);
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
        2,  'Demo',  {tag: '', path: '', title: 'Demo', index: 0}
    ]));

    /**
     * @test {PageStack#cache}
     * @test {PageStack#record}
     * @test {PageStack#push}
     */
    it('Go to a new page',  async () => {

        await page.click('nav > a');

        await waitForNav();

        (await page.$eval('cell-router',  router => [
            history.length, router.path, document.title, history.state
        ])).should.be.eql([
            3, 'test', 'Test', {
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
    it('Reload SPA from the Root path',  async () => {

        await page.reload();

        await page.goForward();    await waitForNav();

        await firstPage();
    });

    /**
     * @test {CellRouter.route}
     */
    it('Handle route based on Custom events',  async () => {

        var data = consoleData();

        await page.click('nav > a:last-child');

        (await data).should.be.equal('PAGE-WELCOME PAGE-HELLO');

        data = consoleData();

        await page.goBack();

        (await data).should.be.equal('PAGE-HELLO PAGE-WELCOME');
    });

    /**
     * @test {CellRouter#boot}
     */
    it('Reload SPA from a Sub path',  async () => {

        await page.reload();

        await waitForNav();

        await firstPage();
    });
});

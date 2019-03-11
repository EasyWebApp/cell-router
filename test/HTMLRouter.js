import PuppeteerBrowser from 'puppeteer-browser';


var page;

function getPath() {

    return  page.evaluate(() => self['cell-router'].History.getPath());
}


/**
 * @test {HTMLRouter}
 */
describe('Router',  () => {

    before(async () => page = await PuppeteerBrowser.getPage('', 'test/'));
    /**
     * @test {HTMLRouter#connectedCallback}
     * @test {HTMLRouter#load}
     */
    it('Load a Page component',  async () => {

        await page.waitFor('page-index');

        (await getPath()).should.be.equal('/index');
    });

    /**
     * @test {HTMLRouter#back}
     */
    it('Go back',  async () => {

        await page.click('a:nth-child(2)');

        await page.waitFor('app-router h1');

        (await getPath()).should.be.equal('/secret/1');

        (await page.$eval('app-router h1',  title => title.textContent))
            .should.be.equal('Secret 1');

        await page.goBack();

        await page.waitFor('page-index');
    });

    /**
     * @test {HTMLRouter#back}
     * @test {back}
     */
    it('Going back can be canceled',  async () => {

        await page.goForward();

        (await getPath()).should.be.equal('/index');
    });

    /**
     * @test {History.getPath}
     * @test {HTMLRouter#connectedCallback}
     */
    it('Reload on Hash mode',  async () => {

        await page.reload();

        await page.waitFor('page-index');
    });
});

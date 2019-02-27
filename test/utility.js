import { clearPath } from '../source/utility';


describe('Utility methods',  () => {
    /**
     * @test {clearPath}
     */
    it('Clear path',  () =>
        clearPath('./a/\\./b/../c').should.be.equal('a/c')
    );
});

import History from '../source/History';


const stack = new History(), { history } = self;


/**
 * @test {History}
 */
describe('History',  () => {
    /**
     * @test {History#add}
     */
    it('Add a page',  () => {

        const page = {
            path:    '/test',
            title:   'Test',
            source:  '<h1>Test</h1>',
            index:   0
        };

        stack.add('/test', 'Test', '<h1>Test</h1>').should.be.eql( page );

        stack[0].should.be.eql( page );
        stack.should.have.length( 1 );
        stack.lastIndex.should.be.equal( 0 );

        history.state.should.be.eql( page );
    });

    /**
     * @test {History#add}
     */
    it('Add third page after back from the second',  () => {

        stack.add('/example', 'Example', '<h1>Example</h1>');

        history.back();
        stack.lastIndex = 0;

        stack.add('/sample', 'Sample', '<h1>Sample</h1>');

        stack.should.have.length( 2 );
        stack[1].should.be.eql({
            path:    '/sample',
            title:   'Sample',
            source:  '<h1>Sample</h1>',
            index:   1
        });
        stack.lastIndex.should.be.equal( 1 );
    });

    /**
     * @test {History#rollback}
     */
    it('Rollback changed path',  () => {

        history.back();

        stack.rollback( stack[0] );

        history.state.should.be.eql( stack[1] );
    });
});

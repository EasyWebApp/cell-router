import Router from '../source/router/Router';

import {spy} from 'sinon';


/**
 * @test {Router}
 */
describe('Router',  () => {

    const router = new Router(), handler = spy();
    /**
     * @test {Router#register}
     */
    describe('Register route handler',  () => {

        it('Plain path',  () => {

            router.register('test', handler);

            Array.from( router.map.keys() )[0].should.be.eql({
                route:    'test',
                pattern:  /^test/
            });
        });

        it('Path with colon parameters',  () => {

            router.register('test/:id/example/:name', handler);

            Array.from( router.map.keys() )[1].should.be.eql({
                route:      'test/:id/example/:name',
                pattern:    /^test\/([^/]+)\/example\/([^/]+)/,
                parameter:  ['id', 'name']
            });
        });
    });

    /**
     * @test {Router#trigger}
     */
    describe('Trigger route',  () => {

        it('Plain path',  () => {

            router.trigger('test');

            handler.should.be.calledWith({ });
        });

        /**
         * @test {Router#unregister}
         */
        it('Path with colon parameters',  () => {

            router.unregister('test').trigger('test/1/example/sample',  { });

            handler.should.be.calledWith({id: '1', name: 'sample'},  { });
        });
    });
});

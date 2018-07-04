import RouteMap from '../source/router/RouteMap';

import {spy} from 'sinon';


/**
 * @test {RouteMap}
 */
describe('Route map',  () => {

    const router = new RouteMap(), handler = spy();
    /**
     * @test {RouteMap#set}
     */
    describe('Register route handler',  () => {

        it('Plain path',  () => {

            router.set('test', handler);

            Array.from( router.map.keys() )[0].should.be.eql({
                route:    'test',
                pattern:  /^test/
            });
        });

        it('Path with colon parameters',  () => {

            router.set('test/:id/example/:name', handler);

            Array.from( router.map.keys() )[1].should.be.eql({
                route:      'test/:id/example/:name',
                pattern:    /^test\/([^/]+)\/example\/([^/]+)/,
                parameter:  ['id', 'name']
            });
        });

        it('Regular expression',  () => {

            router.set(/^sample\/([^/]+)/, handler);

            router.trigger('sample/1');

            handler.should.be.calledWith( ['1'] );
        });
    });

    /**
     * @test {RouteMap#trigger}
     */
    describe('Trigger route',  () => {

        it('Plain path',  () => {

            router.trigger('test');

            handler.should.be.calledWith([ ]);
        });

        /**
         * @test {RouteMap#delete}
         */
        it('Path with colon parameters',  () => {

            router.delete('test').trigger('test/1/example/sample',  { });

            handler.should.be.calledWith({id: '1', name: 'sample'},  { });
        });
    });
});

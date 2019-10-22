import './DOM-polyfill';
import { parsePathData } from '../source/utility';

describe('Utility methods', () => {
    it('should parse URL to parts object', () => {
        expect(parsePathData('test/example?a=1&b=2&b=3')).toEqual(
            expect.objectContaining({
                path: 'test/example',
                params: { a: 1, b: [2, 3] }
            })
        );
    });
});

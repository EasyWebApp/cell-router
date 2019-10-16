import './DOM-polyfill';
import { parseURL } from '../source/utility';

describe('Utility methods', () => {
    it('should parse URL to parts object', () => {
        expect(parseURL('test/example?a=1&b=2&b=3')).toEqual(
            expect.objectContaining({
                hash: '',
                host: 'localhost',
                hostname: 'localhost',
                href: 'http://localhost/test/example?a=1&b=2&b=3',
                origin: 'http://localhost',
                password: '',
                pathname: '/test/example',
                port: '',
                protocol: 'http:',
                search: '?a=1&b=2&b=3',
                searchParams: { a: 1, b: [2, 3] },
                username: ''
            })
        );
    });
});

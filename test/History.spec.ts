import './polyfill';
import History from '../source/History';

describe('History', () => {
    var history: History;

    it('should have correct properties after construction', () => {
        history = new History();

        expect(history.root).toBe('/');
        expect(history.mode).toBe('#');
    });

    it('should change path & title of document after calling .goto()', () => {
        history.push('/test', 'Test');

        expect(history.path).toBe('/test');
        expect(document.title).toBe('Test');
    });

    it('should emit callback after changing path', () => {
        const example_handler = jest.fn();

        history.on('push', /exam/, example_handler);
        history.push('/example', 'Example');

        expect(example_handler).toBeCalledWith(
            '/example',
            expect.arrayContaining(['exam'])
        );
    });

    it('should handle <a /> or <area /> clicking', () => {
        const sample_handler = jest.fn(),
            link = document.querySelector('a');

        history.on('push', '/sample', sample_handler);
        link!.click();

        expect(sample_handler).toBeCalledTimes(1);
    });
});

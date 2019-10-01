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
});

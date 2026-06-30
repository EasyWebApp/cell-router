/** @jest-environment jsdom */

import { History, RouterMode } from '../source/History';

describe('History', () => {
    var pushState: jest.SpiedFunction<typeof window.history.pushState>;

    beforeEach(() => {
        document.head.innerHTML = '<title>Cell Router</title>';
        document.body.innerHTML = '';

        pushState = jest.spyOn(window.history, 'pushState').mockImplementation(() => undefined);

        Object.defineProperty(window, 'navigation', {
            writable: true,
            configurable: true,
            value: undefined
        });
    });

    afterEach(() => {
        pushState.mockRestore();
    });

    it('should use Navigation API to navigate links', () => {
        const navigate = jest.fn();

        Object.defineProperty(window, 'navigation', {
            writable: true,
            configurable: true,
            value: {
                navigate,
                addEventListener: jest.fn(),
                currentEntry: { getState: () => ({ title: 'Cell Router' }) }
            }
        });

        const history = new History('https://example.com', RouterMode.history);
        const link = document.createElement('a');

        link.title = 'List page';
        link.setAttribute('href', '/list/1');

        history.handleLink(new MouseEvent('click', { cancelable: true }), link);

        expect(navigate).toHaveBeenCalledWith('/list/1', {
            state: { title: 'List page' },
            history: 'push'
        });
        expect(history.path).toBe('/list/1');
        expect(pushState).not.toHaveBeenCalled();
    });

    it('should fallback to History API for links without Navigation API', () => {
        const history = new History('https://example.com', RouterMode.history);
        const link = document.createElement('a');

        link.title = 'List page';
        link.setAttribute('href', '/list/1');

        history.handleLink(new MouseEvent('click', { cancelable: true }), link);

        expect(pushState).toHaveBeenCalledWith({ title: 'List page' }, '', '/list/1');
        expect(history.path).toBe('/list/1');
    });

    it('should use Navigation API to submit GET forms', () => {
        const navigate = jest.fn();

        Object.defineProperty(window, 'navigation', {
            writable: true,
            configurable: true,
            value: {
                navigate,
                addEventListener: jest.fn(),
                currentEntry: { getState: () => ({ title: 'Cell Router' }) }
            }
        });

        const history = new History('https://example.com', RouterMode.history);
        const form = document.createElement('form');

        form.setAttribute('action', '/search');
        form.setAttribute('method', 'get');
        form.innerHTML = '<input name="keyword" value="router" />';

        history.handleForm(new Event('submit', { cancelable: true }), form);

        expect(navigate).toHaveBeenCalledWith('/search?keyword=router', {
            state: { title: undefined },
            history: 'push'
        });
        expect(history.path).toBe('/search?keyword=router');
        expect(pushState).not.toHaveBeenCalled();
    });
});

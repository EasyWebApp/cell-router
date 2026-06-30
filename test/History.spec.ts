/** @jest-environment jsdom */

import { History, RouterMode } from '../source/History';

describe('History', () => {
    let pushStateSpy: jest.SpiedFunction<typeof window.history.pushState>;

    beforeEach(() => {
        document.head.innerHTML = '<title>Cell Router</title>';
        document.body.innerHTML = '';

        pushStateSpy = jest.spyOn(window.history, 'pushState').mockImplementation(() => {});

        Object.defineProperty(window, 'navigation', {
            writable: true,
            configurable: true,
            value: undefined
        });
    });

    afterEach(() => {
        pushStateSpy.mockRestore();
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
        expect(pushStateSpy).not.toHaveBeenCalled();
    });

    it('should fallback to History API for links without Navigation API', () => {
        const history = new History('https://example.com', RouterMode.history);
        const link = document.createElement('a');

        link.title = 'List page';
        link.setAttribute('href', '/list/1');

        history.handleLink(new MouseEvent('click', { cancelable: true }), link);

        expect(pushStateSpy).toHaveBeenCalledWith({ title: 'List page' }, '', '/list/1');
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
            state: { title: 'Cell Router' },
            history: 'push'
        });
        expect(history.path).toBe('/search?keyword=router');
        expect(pushStateSpy).not.toHaveBeenCalled();
    });

    it('should fallback to History state when Navigation state is empty', () => {
        window.history.replaceState(
            { title: 'Fallback title' },
            '',
            `${window.location.origin}/fallback`
        );

        Object.defineProperty(window, 'navigation', {
            writable: true,
            configurable: true,
            value: {
                addEventListener: jest.fn(),
                currentEntry: { getState: () => undefined }
            }
        });

        new History('https://example.com', RouterMode.history);

        expect(document.title).toBe('Fallback title');
    });
});

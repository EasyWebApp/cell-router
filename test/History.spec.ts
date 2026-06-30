/** @jest-environment jsdom */

import { History, RouterMode } from '../source/History';

describe('History', () => {
    let navigate: jest.Mock;

    beforeEach(() => {
        document.head.innerHTML = '<title>Cell Router</title>';
        document.body.innerHTML = '';
        navigate = jest.fn();

        Object.defineProperty(window, 'navigation', {
            writable: true,
            configurable: true,
            value: {
                navigate,
                addEventListener: jest.fn(),
                currentEntry: { getState: () => ({ title: 'Cell Router' }) }
            }
        });
    });

    it('should use Navigation API to navigate links', () => {
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
    });

    it('should use Navigation API to submit GET forms', () => {
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
    });

    it('should restore title from Navigation API state', () => {
        Object.defineProperty(window, 'navigation', {
            writable: true,
            configurable: true,
            value: {
                addEventListener: jest.fn(),
                navigate,
                currentEntry: { getState: () => ({ title: 'Navigation title' }) }
            }
        });

        new History('https://example.com', RouterMode.history);

        expect(document.title).toBe('Navigation title');
    });
});

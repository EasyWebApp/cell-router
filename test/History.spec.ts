/** @jest-environment jsdom */

describe('History', () => {
    let navigate: jest.Mock;

    function loadHistory(title = 'Cell Router') {
        Object.defineProperty(window, 'navigation', {
            writable: true,
            configurable: true,
            value: {
                navigate,
                addEventListener: jest.fn(),
                currentEntry: { getState: () => ({ title }) }
            }
        });

        jest.resetModules();

        return import('../source/History');
    }

    beforeEach(() => {
        document.head.innerHTML = '<title>Cell Router</title>';
        document.body.innerHTML = '';
        navigate = jest.fn();
    });

    it('should use Navigation API to navigate links', async () => {
        const { History, RouterMode } = await loadHistory();

        const history = new History('https://example.com', RouterMode.history);
        const link = document.createElement('a');

        link.title = 'List page';
        link.href = '/list/1';

        history.handleLink(new MouseEvent('click', { cancelable: true }), link);

        expect(navigate).toHaveBeenCalledWith('/list/1', {
            state: { title: 'List page' },
            history: 'push'
        });
        expect(history.path).toBe('/list/1');
    });

    it('should use Navigation API to submit GET forms', async () => {
        const { History, RouterMode } = await loadHistory();

        const history = new History('https://example.com', RouterMode.history);
        const form = document.createElement('form');

        form.method = 'get';
        form.action = '/search';
        form.innerHTML = '<input name="keyword" value="router" />';

        history.handleForm(new Event('submit', { cancelable: true }), form);

        expect(navigate).toHaveBeenCalledWith('/search?keyword=router', {
            state: { title: 'Cell Router' },
            history: 'push'
        });
        expect(history.path).toBe('/search?keyword=router');
    });

    it('should restore title from Navigation API state', async () => {
        const { History, RouterMode } = await loadHistory('Navigation title');

        new History('https://example.com', RouterMode.history);

        expect(document.title).toBe('Navigation title');
    });
});

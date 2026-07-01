/** @jest-environment jsdom */

describe('History', () => {
    let navigate: jest.Mock;
    let updateCurrentEntry: jest.Mock;
    let listeners: Record<string, (...args: any[]) => void>;

    function loadHistory(title = 'Cell Router') {
        listeners = {};

        Object.defineProperty(window, 'navigation', {
            writable: true,
            configurable: true,
            value: {
                navigate,
                updateCurrentEntry,
                addEventListener: jest.fn((type: string, handler: (...args: any[]) => void) => {
                    listeners[type] = handler;
                }),
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
        updateCurrentEntry = jest.fn();
    });

    it('should use Navigation API to navigate links', async () => {
        const { History, RouterMode } = await loadHistory();

        const history = new History('https://example.com', RouterMode.history);

        history.navigate('/list/1', { title: 'List page' });

        expect(navigate).toHaveBeenCalledWith('/list/1', {
            state: { title: 'List page' },
            history: 'push'
        });
        expect(history.path).toBe('/list/1');
    });

    it('should use Navigation API to submit GET forms', async () => {
        const { History, RouterMode } = await loadHistory();

        const history = new History('https://example.com', RouterMode.history);

        history.navigate('/search?keyword=router', { title: 'Cell Router' });

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

    it('should intercept same-origin Navigation API navigations', async () => {
        const { History, RouterMode } = await loadHistory();

        document.body.innerHTML =
            '<a id="route-link" href="/list/1" title="List page">List page</a>';
        const link = document.getElementById('route-link') as HTMLAnchorElement;

        const history = new History('https://example.com', RouterMode.history);
        const event = {
            canIntercept: true,
            downloadRequest: false,
            formData: null,
            hashChange: false,
            sourceElement: link,
            destination: { url: 'https://example.com/list/1' },
            intercept: jest.fn()
        };

        listeners.navigate(event);

        expect(event.intercept).toHaveBeenCalledWith(
            expect.objectContaining({
                scroll: 'manual',
                focusReset: 'manual',
                handler: expect.any(Function)
            })
        );

        await event.intercept.mock.calls[0][0].handler();

        expect(history.path).toBe('/list/1');
        expect(document.title).toBe('List page');
        expect(updateCurrentEntry).toHaveBeenCalledWith({ state: { title: 'List page' } });
    });
});

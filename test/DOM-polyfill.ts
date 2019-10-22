import { JSDOM } from 'jsdom';

const { window } = new JSDOM('', {
    url: 'http://localhost/',
    pretendToBeVisual: true
});

for (const key of ['window', 'document', 'URL']) {
    // @ts-ignore
    global[key] = window[key];
}

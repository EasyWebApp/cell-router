import { JSDOM } from 'jsdom';

const { window } = new JSDOM('', { url: 'http://localhost/' });

for (const key of ['window', 'URL']) {
    // @ts-ignore
    global[key] = window[key];
}

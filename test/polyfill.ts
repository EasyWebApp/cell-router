import { JSDOM } from 'jsdom';

const { window } = new JSDOM('<a href="/sample">Sample</a>', {
    url: 'http://localhost/'
});

// @ts-ignore
for (const name of ['window', 'document']) global[name] = window[name];

import { JSDOM } from 'jsdom';

const { window } = new JSDOM('', { url: 'http://localhost/' });

// @ts-ignore
for (const name of ['window', 'document']) global[name] = window[name];

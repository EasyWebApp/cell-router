import { component } from 'web-cell';

import HTMLRouter, { load, back } from 'cell-router';


@component()
export default class AppRouter extends HTMLRouter {

    @load('/index')
    indexPage() {  return '<page-index />';  }

    @load('/secret/:id')
    secretPage(id) {  return `<h1>Secret ${id}</h1>`;  }

    @back('/secret')
    burnAfterRead() {  return false;  }
}

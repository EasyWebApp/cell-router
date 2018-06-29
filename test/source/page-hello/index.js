export default  class PageHello extends HTMLElement {

    constructor() {

        super().attachShadow({mode: 'open'}).append('Hello, Web components!');
    }
}

customElements.define('page-hello', PageHello);

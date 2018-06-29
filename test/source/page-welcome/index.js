export default  class PageWelcome extends HTMLElement {

    constructor() {

        super().attachShadow({mode: 'open'}).append('Welcome to WebCell\'s world!');
    }
}

customElements.define('page-welcome', PageWelcome);

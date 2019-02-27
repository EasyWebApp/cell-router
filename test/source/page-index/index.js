import { component } from 'web-cell';


@component({
    template:  '<h1>Index</h1>'
})
export default  class PageIndex extends HTMLElement {

    constructor() {  super().buildDOM();  }
}

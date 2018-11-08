# Cell Router

Router component based on [WebCell](https://web-cell.tk/)

[![NPM Dependency](https://david-dm.org/EasyWebApp/cell-router.svg)](https://david-dm.org/EasyWebApp/cell-router)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FEasyWebApp%2Fcell-router.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FEasyWebApp%2Fcell-router?ref=badge_shield)

[![NPM](https://nodei.co/npm/cell-router.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/cell-router/)



## Feature

 - [x] **Page link**
   - `<a href="route/path">Page title</a>`
   - `<a href="route/path" title="Page title" target="_self">Example page</a>`
 - [x] **Page container**: `<main />` with `pagechange` & `pagechanged` custom events
 - [x] **Path mode**: `location.hash` (default) & `history.pushState()`
 - [x] **Page loader**: auto detect **UMD** & **ES module**
 - [x] **DOM cache**
 - [x] **Route handler**: Similar with [Express.js](https://expressjs.com/en/guide/routing.html)



## Usage

First
```Shell
npm install cell-router
```
then write your **SPA index page** follow [the example](https://github.com/EasyWebApp/cell-router/tree/master/test)



## API Document

 - Online: [URL](https://easywebapp.github.io/cell-router/) or `npm docs`

 - Offline: `npm run help`


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FEasyWebApp%2Fcell-router.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FEasyWebApp%2Fcell-router?ref=badge_large)
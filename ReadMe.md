# Cell Router

Router component based on [WebCell](https://web-cell.tk/)

[![NPM Dependency](https://david-dm.org/EasyWebApp/cell-router.svg)](https://david-dm.org/EasyWebApp/cell-router)
[![Build Status](https://travis-ci.com/EasyWebApp/cell-router.svg?branch=master)](https://travis-ci.com/EasyWebApp/cell-router)
[![](https://data.jsdelivr.com/v1/package/npm/cell-router/badge?style=rounded)](https://www.jsdelivr.com/package/npm/cell-router)

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

 - Online: [URL](https://web-cell.tk/cell-router/) or `npm docs`

 - Offline: `npm run help`

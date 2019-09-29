# Udacity Front-End Dev Nanodegree
## Project-5 Restaurant Reviews App
---
## Project Overview

The **Restaurant Reviews** project has the objective of transforming the code for a restaurant reviews app into a responsive, progressive web app that meets WCAG 2.1 accessibility requirements.

## Running the application

The application should be served locally (i.e. using a local web server).

1. From the project root folder, where the index.html file is located, run the HTTP server, e.g.,
`python -m SimpleHTTPServer 8000` or `python -m http.server 8000` for python version 2 and version 3 respectively.
Note that if port 8000 is unavailable, a different port number may be specified and must also be modified in **dbhelper.js**. If Python is not installed, it can be downloaded from Python's [website](https://www.python.org/).

2. Navigate to `localhost:8000` using the latest version of Chrome or Firefox.

There is also a live version of the app without the progressive web app features [here](http://users.tpg.com.au/alorient/fend-proj5/). Since it the app is being served over an unsecure HTTP protocol the service worker is non-functional.

## Summary of changes

Changes made to the code to meet the project objectives have been commented with a "_>>>_" prefix.

### Responsive design

In order to allow the application to render correctly and be usable over a range of viewport sizes for mobile, tablet and desktop a number of changes were made. The home page was adapted to a flexbox layout. The restaurant listings are able to wrap across multiple rows and therefore can adapt to a range of viewport sizes. A positional layout was retained for the restaurant details page to allow the map to be fixed on a desktop screen.

Breakpoints were created at strategic points to allow the pages to adapt naturally and variable width margins allow a fluid design between the breakpoints.

### Progressive web app  

A service worker was implemented allowing resources to be cached on installation (i.e. on loading). By using a cache then network strategy, content is served to the user as quickly as possible. Key information is also available to the user while offline.

### Accessibility

A number of changes were required to meet WCAG 2.1.

#### Focus and keyboard

The default focus ring was not easily visible, particularly on the blue map background. The default was replaced with a generic red outline and enhanced for other key elements. For the map itself, a content box is displayed informing the user to use the arrow keys to pan across the map. A _keypress_ event handler was also added to the map markers allowing them to be usable by keyboard-only users.

### Colour contrast

The colour of several elements was modified to enhance the colour contrast ratio consistent with a WCAG 2.1 AAA rating.

### Skip links -  bypass content

A skip link was included on the home page to allow the user to bypass map information (markers etc.) and proceed to the restaurant listing.

## Note regarding Mapbox Accessibility

There are a number of accessibility issues relating to Mapbox which have not been addressed in the app. The main problem is that the user is able to move (pan or zoom) to a region on the map where no markers exist and then _tab_ to a marker that is no longer onscreen. A possible solution is to centre the map on the focused marker by handling the _focus_ event.
Another problem is that a meaningful _tab_ sequence is not applied within the map.

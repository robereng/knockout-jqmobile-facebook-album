Knockout JQMobile Facebook app
=====

This is a simple single page mobile app, logging into facebook and allowing the user to browse photos from their albums. It uses knockout.js, jquerymobile, and the facebook javascript API.

I wanted to avoid using a single big view model for everything. You can get around this by assigning a viewmodel label to the relevant block of HTML (a jquery mobile page), in the 'data-viewmodel' attribute.

Each view model has an 'activate' function, which is triggered whenever a page change event is fired.  This activate function assigns all the relevant values to a global context which holds all view model data.

Each view model then does its business and updates the URL using a jQM transition. It's quite a nice modular approach for knockout that is relevant for this type of app.

Documentation
=====

It can be seen working here:

http://robereng.github.io/knockout-jqmobile-facebook-album

Download, look at the source and work it out :-)
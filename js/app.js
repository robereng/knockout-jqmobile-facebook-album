window.fbAsyncInit = function() {
	FB.init({appId: '546021512107492', cookie: true, status: true, xfbml: true, oauth : true});

	FB.Event.subscribe('auth.login', function(response) {
		console.log('User is Logged In');
	});

	FB.Event.subscribe('auth.logout', function(response) {
		console.log('Session was terminated!');
	});

	FB.Event.subscribe('edge.create', function(response) {
		console.log("User liked <a target='_blank' href='" + response + "'>this page.</a>");
	});
};
(function() {
	var e = document.createElement('script');
	e.async = true;
	e.src = document.location.protocol + '//connect.facebook.net/en_US/all.js';
	document.getElementById('fb-root').appendChild(e);
}());

var globalContext = (function(){

	this.friends = [];
	this.albums = [];
	this.photos = [];
	this.username = "";
    this.picture = "";
	this.email = "";
	
	return {
        friends: friends,
        albums: albums,
		photos: photos,
		username: username,
		picture: picture,
		email: email
    };

})();

var introViewModel = (function(globalContext){

	this.login = function() {

        FB.login(function(response) {
			if (response.authResponse) {
				//To get user details
				FB.api('/me', function(user) {
					globalContext.username = user.name;
					globalContext.email = user.email;
					FB.api('/me/picture', function(path) {
						globalContext.picture = path.data.url;
						$.mobile.changePage("#user");
					});				
				});

			} else {
				console.log('FB login was not successful.');
			}
		}, {scope:'publish_stream,email,user_photos,offline_access'});
    };
	
	return{
		login: login
	};

})(globalContext);

// the user page view model
var userViewModel = (function(globalContext) {
    
	this.username = ko.observable("");
    this.picture = ko.observable("");
	this.email = ko.observable("");

	this.getFriends = function() {
		var _this = this;
		FB.api('/me/friends', function(response) {
        if(response.data) {
			globalContext.albums.length = 0;
            $.each(response.data,function(index,friend) {
				globalContext.friends.push(friend);
            });
			$.mobile.changePage("#friends", { transition: "slidefade"});
			} else {
				console.log('FB login was not successful.');
			}
		});
	};
	
	this.getAlbums = function() {
		var _this = this;
		FB.api('/me/albums', function(response) {
        if(response.data) {
			globalContext.albums.length = 0;
            $.each(response.data,function(index,album) {
				globalContext.albums.push(album);
            });
			$.mobile.changePage("#albums", { transition: "pop"});
			} else {
				console.log('FB login was not successful.');
			}
		});
	};
	
	this.activate = function() {
        this.username(globalContext.username);
        this.picture(globalContext.picture);
        this.email(globalContext.email);
    };
	
	return {
		username: username,
		picture: picture,
		email: email,
        getFriends: getFriends,
        getAlbums: getAlbums,
		activate: activate
    };
    
})(globalContext);

// the friends page view model
var friendsViewModel = (function(globalContext){

	this.friends = ko.observableArray([]);

    this.activate = function() {
        this.friends(globalContext.friends);
    };
    
    return {
		friends: friends,
		activate: activate
	};
	
})(globalContext);

// the albums page view model
var albumsViewModel = (function(globalContext) {

	this.albums = ko.observableArray([]);

	this.getPhotos = function(album) {
		var _this = this;
		FB.api('/' + album.id + '/photos', function(response) {
        if(response.data) {
			globalContext.photos.length = 0;
            $.each(response.data,function(index,photo) {
				globalContext.photos.push(photo);
            });
			$.mobile.changePage("#photos", { transition: "flip"});
			} else {
				console.log('FB login was not successful.');
			}
		});
	};
	
	this.activate = function() {
        this.albums(globalContext.albums);
    };
        
    return {
		albums: albums,
		getPhotos: getPhotos,
		activate: activate
	};

})(globalContext);

// the photos page view model
var photosViewModel = (function(globalContext){

	this.photos = ko.observableArray([]);
	
	this.activate = function() {
        this.photos(globalContext.photos);
    };
        
    return {
		photos: photos,
		activate: activate
	};
	
})(globalContext);

// on each page change event, get the relevant view model.
$(document).bind("pagechange", function (e, info) {

    var page = info.toPage[0];

    console.log("Changing page to: " + page.id);

    // get view model name
    var viewModelName = info.toPage.attr("data-viewmodel");
    if (viewModelName) {
        // get view model object
        var viewModel = window[viewModelName];

        // apply bindings if they are not yet applied
        if (!ko.dataFor(page)) {
            ko.applyBindings(viewModel, page);
        }

        // call activate on view model if implemented
        if (viewModel && viewModel.activate && typeof viewModel.activate === "function") {
            viewModel.activate();
        }
    }
});

// refreshList custom binding
// refreshes runs jQuery Mobile on newly added DOM elements in a listview
ko.bindingHandlers.refreshList = {
    update: function (element, valueAccessor, allBindingsAccessor) {
        $(element).listview("refresh");
        $(element).trigger("create");
    }
};


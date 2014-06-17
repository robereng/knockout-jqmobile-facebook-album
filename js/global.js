var config = (function(){
	
	var config = {};
	
	switch(location.host){
		
		// Dev
		case "dev":
			config.remoteDomain = "http://****.dev.zonedemos.com";
			config.fbid = '0000000000';
		break;
		
		// Staging
		case "staging":
			config.remoteDomain = "http://****.stage.zonedemos.com";
			config.fbid = '0000000000';
			config.GA = "UA-0000000-0";
		break;
			
		// Production
		case "production":
			config.remoteDomain = "http://****.com";
			config.fbid = '0000000000';
			config.GA = "UA-0000000-0";
		break;
	}
	
	return config;
})();
const request = require('request');

request("http://www.osboxes.org/sitemap/", function(err, response, body) {
	var temp_body = body.replace(/\n/g, '');
	var res = temp_body.match(/<ul class="wsp-pages-list">.*?<\/ul>/);
	var options = res[0];
	var values = options.match(/"http:\/\/www.osboxes.*?"/g);
	var links = [];
	values.forEach(function(element) {
		var clean_value = element.replace(/"/g, '');
		links.push(clean_value);
	});
	links.forEach(function(os) {
		getDownloadLinks(os, function(download_links) {
			if ( download_links == undefined || download_links.length == 0 ) {
				console.error("NO LINKS:", os);
			} else {
				download_links.forEach(function(row) {
					console.log("LINK:", row);
				});
			}
		});
	});
//	var split_options = res[0].split('<option');
//	console.log(split_options);
});


function getDownloadLinks(link, callback) {
	request(link, function(err, response, body) {
		if (err) {
			console.error(link, err);
			return callback();
		}

		if ( response.statusCode == 500 ) {
			return getDownloadLinks(link, callback);
		}

		var temp_body = body.replace(/\n/g, '');
		var res = temp_body.match(/\"http:\/\/sourceforge.net.*?\"/g);

		if ( res === undefined || res === null ) {
			console.error(link, response.statusCode, 'no links');
			return callback();
		}
		
		var links = [];
		res.forEach(function(url) {
			var clean_url = url.replace(/"/g, '');
			links.push(clean_url);
		});
		callback(links);
	});
}

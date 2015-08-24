(function(exports, undefined){

    // replace this api info with yours!!
	var flybaseKudos = new Flybase("YOUR-API-KEY", "YOUR-APP", "kudos");
	var key = document.location.pathname.replace(/[\/-]/g,'');

    // fix for local debugging
    if(key === ''){
        key = 'localhost'
    }
	
	function createUUID() {
		var s = [];
		var hexDigits = "0123456789abcdef";
		for (var i = 0; i < 36; i++) {
			s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
		}
		s[14] = "4";  // bits 12-15 of the time_hi_and_version field to 0010
		s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);  // bits 6-7 of the clock_seq_hi_and_reserved to 01
		s[8] = s[13] = s[18] = s[23] = "-";
		
		var uuid = s.join("");
		return uuid;
	}
	
	function getAuthData(){
		if( localStorage.getItem("uuid") === null) {
			var uuid = createUUID();
			localStorage.setItem("uuid",uuid);
			return uuid;
		}else{
			return localStorage.getItem("uuid");
		}
	}

	String.prototype.hashCode = function(){
	    if (Array.prototype.reduce){
	        return this.split("").reduce(function(a,b){a=((a<<5)-a)+b.charCodeAt(0);return a&a},0);              
	    } 
	    var hash = 0;
	    if (this.length === 0) return hash;
	    for (var i = 0; i < this.length; i++) {
	        var character  = this.charCodeAt(i);
	        hash  = ((hash<<5)-hash)+character;
	        hash = hash & hash; // Convert to 32bit integer
	    }
	    return hash;
	}
	
	var uid = getAuthData();
//	unique hash based on user id and site url...
	var hash = new String( uid + '.' + key ).hashCode();


    var hasVoted = function(){
		var deferred = $.Deferred();
		flybaseKudos.where({ "$and": [ {"key": key }, {"uid": uid } ] }).on('value', function(data){
			deferred.resolve( data.count() !== null);
		});
		return deferred.promise();
	};

    var addKudo = function(){
		flybaseKudos.set({
			'key' : key,
			'hash' : hash,
			'uid' : uid,
			'likes' : 1
		});
	};
	
    var removeKudo = function(){
		flybaseKudos.where( { "$and": [ {"key": key }, {"uid": uid } ] } ).on('value', function(data){
			if( data.count() ){
				data.forEach( function(snapshot){
					var doc = snapshot.value();
					flybaseKudos.deleteDocument( doc._id );
				});
			}
		});
	};

    // listening for updates
    var onKudoUpdates = function(cb){
		var likeCount = 0;
		flybaseKudos.where({'key' : key}).on('value', function(data){
			likeCount = data.count();
			cb( likeCount );
		});

		flybaseKudos.on('added', function(data){
			if( data.value().key == key ){
				likeCount = likeCount + 1;
			}
			cb( likeCount );
		});

		flybaseKudos.on('removed', function(data){
			if( data.value().key == key ){
				likeCount = likeCount - 1;
			}
			cb( likeCount );
		});
    };

    var flybaseStorage = {
        hasVoted: hasVoted,
        addKudo: addKudo,
        removeKudo: removeKudo,
        onKudoUpdates: onKudoUpdates
    };

    exports.flybaseStorage = flybaseStorage;

})(window);
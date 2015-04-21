Object.prototype.forEach = function (callback) {
	for(var i in this) {
		if(this.hasOwnProperty(i)) {
			if(typeof callback === 'function') {
				callback(this[i], i);
			}
		}
	}
};
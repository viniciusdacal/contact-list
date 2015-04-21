var TemplateRender = (function () {
	var render = function (template, scope) {
		template = template.cloneNode(true);
		if(scope) {
			var text = template.outerHTML;
			var re = /\{\{(.*?)\}\}/;
			while(res = re.exec(text)) {
				var path = res[1].trim();
				var occurrence = res[0];
				var val = ( new Function ("scope", "return scope." + path)(scope));
				text = text.replace(new RegExp(occurrence, 'g'), val);
			}

			var wrapper = document.createElement('div');
			wrapper.innerHTML = text;
			return wrapper.firstChild;
		}

	};

	return {
		render: render
	};
}());


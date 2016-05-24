export default class Loader {
	static image(url : string, next: Function) {   
		var img = new Image();
		img.onerror = e => next(null, e);
		img.onload = _ => next(img);
		img.src = url;
	}

	static text(url : string, next: Function) {   
		var xobj = new XMLHttpRequest();
		xobj.overrideMimeType("application/json");
		xobj.open('GET', url, true);
		xobj.onreadystatechange = function () {
			if (xobj.readyState == 4 && xobj.status == "200") {
				next(xobj.responseText);
			}
		};
		xobj.send(null);  
	}

	static json(url : string, next: Function) {
		this.text(url, txt => next(JSON.parse(txt)));
	}
}

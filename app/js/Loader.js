export default class Loader {
	static image(url : string) {
		return new Promise(
			function (resolve, reject) {
				var img = new Image();
				img.onerror = e => reject(e);
				img.onload = _ => resolve(img);
				img.src = url;
			}
		);
	}

	static text(url : string) {
		return new Promise(
			function (resolve, reject) {
				var xobj = new XMLHttpRequest();
				xobj.overrideMimeType("application/json");
				xobj.open('GET', url, true);
				xobj.onreadystatechange = function () {
					if (xobj.readyState == 4) {
						if(xobj.status == "200") {
							resolve(xobj.responseText);
						} else if (xobj.status > 400) {
							reject("Erro");
						}
					}
				};
				xobj.send(null);
				xobj.addEventListener("error", () => { reject("Error") }, false);
			}
		);
	}

	static json(url : string) {
		return this.text(url);
	}
}

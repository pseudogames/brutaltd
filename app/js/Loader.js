export default class Loader {
	static image(url : string, next: Function) {   
		return new Promise(
			function (resolve, reject) {
				var img = new Image();
				img.onerror = e => reject(e);
				img.onload = _ => resolve(data);
				img.src = url;
			}
		);
	}

	static text(url : string, next: Function) {   
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
				oReq.addEventListener("error", () => { reject("Error") }, false);
			}
		);
	}

	static json(url : string, next: Function) {
		return this.text(url);
	}
}

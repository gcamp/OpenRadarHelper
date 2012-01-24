function saveUpdatedContent() {
	safari.self.tab.dispatchMessage("status", document.getElementById("probid1").getElementsByClassName("data01")[1].textContent);
	safari.self.tab.dispatchMessage("description", document.getElementById("probDes").value + "\n\n" + document.getElementById("ADCNote").value);
	
	var radarNumer = document.getElementsByTagName("font")[5].textContent
	radarNumer = radarNumer.replace(/(\r\n|\n|\r)/gm,""); //Remove new line
	radarNumer = radarNumer.replace(/[ \t\r]+/g,""); //Remove white space
	safari.self.tab.dispatchMessage("updateRadarNumber", radarNumer);
	safari.self.tab.dispatchMessage("wantsUpdateRadar", "yes");
	
	window.open('http://www.openradar.me/myradars', "new tab");
}

function lookForRadarToUpdate() {
		safari.self.tab.dispatchMessage("getUpdateValue", "updateRadarNumber");
}

function addUpdateButton() {
	var button = document.createElement('input');
	button.setAttribute('type','button');
	button.setAttribute("value", "Update this radar on OpenRadar");
	button.setAttribute("style", "position: relative; top: -6px; left: 20px;")
	button.onclick = saveUpdatedContent;
		
	var headerNode = document.getElementsByName('Revert')[0];
	
	headerNode.parentNode.insertBefore(button, headerNode.nextSibling.nextSibling.nextSibling.nextSibling.nextSibling);
}

function  fillUpdatedContent() {
	safari.self.tab.dispatchMessage("getOpenRadarValue", "status");
	safari.self.tab.dispatchMessage("getOpenRadarValue", "description");

	//clearRadarContent();
}
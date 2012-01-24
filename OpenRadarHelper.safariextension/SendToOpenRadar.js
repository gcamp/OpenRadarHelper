var originalAction;

function sendToOpenRadar() {
	saveRadarContent();
	
	if (originalAction !== null) originalAction(); //Run the original action
}

function saveRadarContent() {	
//Save the radar content in the localStorage
//We need to send message to GlobalPage.html because injected script (this js) store use the site local storage, not the extension one.
	safari.self.tab.dispatchMessage("title", document.getElementById("probTitleNewProb").value);
	safari.self.tab.dispatchMessage("product", document.getElementById("prodList").options[document.getElementById("prodList").selectedIndex].text);
	safari.self.tab.dispatchMessage("product_version", document.getElementById("version").value);
	safari.self.tab.dispatchMessage("classification", document.getElementById("classList").options[document.getElementById("classList").selectedIndex].text);
	safari.self.tab.dispatchMessage("reproducible", document.getElementById("reproducibleNewProb").options[document.getElementById("reproducibleNewProb").selectedIndex].text);
	safari.self.tab.dispatchMessage("description", document.getElementById("probDescID").value);
	safari.self.tab.dispatchMessage("wantsOpenRadar", "yes");
}

function clearRadarContent() {
//Clear the data after submission
	safari.self.tab.dispatchMessage("number", null);
	safari.self.tab.dispatchMessage("title", null);
	safari.self.tab.dispatchMessage("product", null);
	safari.self.tab.dispatchMessage("product_version", null);
	safari.self.tab.dispatchMessage("classification", null);
	safari.self.tab.dispatchMessage("reproducible", null);
	safari.self.tab.dispatchMessage("description", null);
	safari.self.tab.dispatchMessage("wantsOpenRadar", null);
	
	safari.self.tab.dispatchMessage("status", null);
	safari.self.tab.dispatchMessage("updateRadarNumber", null);
	safari.self.tab.dispatchMessage("wantsUpdateRadar", null);
}

function saveRadarNumberAndSubmit() {
		safari.self.tab.dispatchMessage("number", document.getElementsByTagName("font")[5].textContent);
		
		clearDuplicateContent();
		
		window.open('http://openradar.me/myradars/add', "new tab");		
}

function overwriteSubmitButton() {
	var sendButton = document.getElementsByName("Save")[0];

	originalAction = sendButton.onclick; //Save the action and overwrite the submit button
	sendButton.onclick = sendToOpenRadar;
}

function fillContent () {
//Fill the content on Open Radar. Same process as saveRadarContent().
	var date = new Date();
	document.getElementsByName("originated")[0].value = date.toUTCString();
	document.getElementsByName("status")[0].value = "Open";
	
	safari.self.tab.dispatchMessage("getOpenRadarValue", "number");
	safari.self.tab.dispatchMessage("getOpenRadarValue", "title");
	safari.self.tab.dispatchMessage("getOpenRadarValue", "product");
	safari.self.tab.dispatchMessage("getOpenRadarValue", "product_version");
	safari.self.tab.dispatchMessage("getOpenRadarValue", "classification");
	safari.self.tab.dispatchMessage("getOpenRadarValue", "reproducible");
	safari.self.tab.dispatchMessage("getOpenRadarValue", "description");
	
	clearRadarContent();
};
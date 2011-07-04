var originalAction;

function sendToOpenRadar() {
	if (confirm("Do you want to send this bug to Open Radar too?")) saveRadarContent();
	
	if (originalAction !== null) originalAction(); //Run the original action
}

function overwriteSubmitButton() {
	var sendButton = document.getElementsByName("Save")[0];

	originalAction = sendButton.onclick; //Save the action and overwrite the submit button
	sendButton.onclick = sendToOpenRadar;
}

function saveRadarContent() {	
	safari.self.tab.dispatchMessage("title", document.getElementById("probTitleNewProb").value);
	safari.self.tab.dispatchMessage("product", document.getElementById("prodList").options[document.getElementById("prodList").selectedIndex].text);
	safari.self.tab.dispatchMessage("product_version", document.getElementById("version").value);
	safari.self.tab.dispatchMessage("classification", document.getElementById("classList").options[document.getElementById("classList").selectedIndex].text);
	safari.self.tab.dispatchMessage("reproducible", document.getElementById("reproducibleNewProb").options[document.getElementById("reproducibleNewProb").selectedIndex].text);
	safari.self.tab.dispatchMessage("description", document.getElementById("probDescID").value);
	safari.self.tab.dispatchMessage("wantsOpenRadar", "yes");
}

function clearRadarContent() {
	safari.self.tab.dispatchMessage("number", null);
	safari.self.tab.dispatchMessage("title", null);
	safari.self.tab.dispatchMessage("product", null);
	safari.self.tab.dispatchMessage("product_version", null);
	safari.self.tab.dispatchMessage("classification", null);
	safari.self.tab.dispatchMessage("reproducible", null);
	safari.self.tab.dispatchMessage("description", null);
	safari.self.tab.dispatchMessage("wantsOpenRadar", null);
}

function saveRadarNumberAndSubmit() {
		safari.self.tab.dispatchMessage("number", document.getElementsByTagName("font")[5].textContent);
		
		window.open('http://openradar.appspot.com/myradars/add', "new tab");		
}

function fillContent () {
	var date = new Date();
	document.getElementsByName("originated")[0].value = date.toUTCString();
	document.getElementsByName("status")[0].value = "Open";
	
	safari.self.tab.dispatchMessage("getDatabaseValue", "number");
	safari.self.tab.dispatchMessage("getDatabaseValue", "title");
	safari.self.tab.dispatchMessage("getDatabaseValue", "product");
	safari.self.tab.dispatchMessage("getDatabaseValue", "product_version");
	safari.self.tab.dispatchMessage("getDatabaseValue", "classification");
	safari.self.tab.dispatchMessage("getDatabaseValue", "reproducible");
	safari.self.tab.dispatchMessage("getDatabaseValue", "description");
	
	//clearRadarContent();
};

function sendToOpenRadar() {
	if (confirm("Do you want to send this bug to Open Radar too?")) saveRadarContent();
	
	if (originalAction !== null) originalAction(); //Run the original action
}

function getMessage(msgEvent) {
	if (msgEvent.name == "wantsOpenRadar" && msgEvent.message !== "null") saveRadarNumberAndSubmit();
	else if (msgEvent.message !== "null") document.getElementsByName(msgEvent.name)[0].value = msgEvent.message;
}

if (document.URL == "http://openradar.appspot.com/myradars/add") fillContent();
else if (document.title.indexOf("New Problem") != -1) overwriteSubmitButton();
else if (document.title.indexOf("Home") != -1) safari.self.tab.dispatchMessage("getDatabaseValue", "wantsOpenRadar");

safari.self.addEventListener("message", getMessage, false);
var originalAction;

function sendToOpenRadar() {
	saveRadarContent();
	
	if (originalAction !== null) originalAction(); //Run the original action
}

function overwriteSubmitButton() {
	var sendButton = document.getElementsByName("Save")[0];

	originalAction = sendButton.onclick; //Save the action and overwrite the submit button
	sendButton.onclick = sendToOpenRadar;
}

function saveDuplicateContent() {
	var contentDiv = document.getElementById("content");
	var description = contentDiv.childNodes[3].childNodes[3].textContent;
	
	//Add the mention that's a duplicate
	description = "\n========================" + description;
	description = "Duplicate of : " + contentDiv.childNodes[3].childNodes[1].childNodes[1].childNodes[2].childNodes[1].textContent + description;
	description = "========================\n" + description;
	safari.self.tab.dispatchMessage("probDescID", description);
	
	
	safari.self.tab.dispatchMessage("probTitleNewProb", document.getElementsByTagName("h3")[0].textContent);
	safari.self.tab.dispatchMessage("prodList", contentDiv.childNodes[3].childNodes[1].childNodes[1].childNodes[6].childNodes[1].textContent);
	safari.self.tab.dispatchMessage("version", contentDiv.childNodes[3].childNodes[1].childNodes[1].childNodes[6].childNodes[4].textContent);
	safari.self.tab.dispatchMessage("classList", contentDiv.childNodes[3].childNodes[1].childNodes[1].childNodes[8].childNodes[1].textContent);
	safari.self.tab.dispatchMessage("reproducibleNewProb", contentDiv.childNodes[3].childNodes[1].childNodes[1].childNodes[8].childNodes[4].textContent);
	safari.self.tab.dispatchMessage("wantsDuplicateRadar", "yes");
	
	window.open('https://bugreport.apple.com/', "new tab");		
}

function addDuplicateButton() {
	var button = document.createElement('input');
	button.setAttribute('type','button');
	button.setAttribute("value", "Duplicate this radar on bugreport.apple.com");
	button.setAttribute("style", "position: relative; top: -3px; left: 10px;")
	button.onclick = saveDuplicateContent;
	document.getElementsByTagName('h3')[0].appendChild(button);
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
}

function saveRadarNumberAndSubmit() {
		safari.self.tab.dispatchMessage("number", document.getElementsByTagName("font")[5].textContent);
		
		window.open('http://openradar.appspot.com/myradars/add', "new tab");		
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

function fillDuplicateContent() {
	originalAction();

	safari.self.tab.dispatchMessage("getDuplicateValue", "probTitleNewProb");
	safari.self.tab.dispatchMessage("getDuplicateValue", "prodList");
	safari.self.tab.dispatchMessage("getDuplicateValue", "version");
	safari.self.tab.dispatchMessage("getDuplicateValue", "classList");
	safari.self.tab.dispatchMessage("getDuplicateValue", "reproducibleNewProb");
	safari.self.tab.dispatchMessage("getDuplicateValue", "probDescID");
}

function getMessage(msgEvent) { //The GlobalPage.html returned
	if (msgEvent.name == "openRadar") {
		if (msgEvent.message[0] == "wantsOpenRadar" && msgEvent.message[1] !== "null") saveRadarNumberAndSubmit();
		else if (msgEvent.message[0] == "wantsDuplicateRadar") {
			if (msgEvent.message[1] == "yes") {
				var mainBody = document.getElementsByTagName("body")[0];
				originalAction = mainBody.onload;
				mainBody.onload = fillDuplicateContent;
			}
			else overwriteSubmitButton();
		}	
		else if (msgEvent.message[1] != "null") {
			 document.getElementsByName(msgEvent.message[0])[0].value = msgEvent.message[1];
		}
	}
	else if (msgEvent.name == "duplicate") {
		if (msgEvent.message[0] == "prodList" || msgEvent.message[0] == "classList" || msgEvent.message[0] == "reproducibleNewProb") {
			var selectedIndex = 0;
			var options = document.getElementById(msgEvent.message[0]).options;
			for(var index = 0; index < options.length; index++) {
				var textValue = options[index].text;
				if (textValue.indexOf(msgEvent.message[1]) != -1 && selectedIndex == 0) selectedIndex = index;
			}
			
			document.getElementById(msgEvent.message[0]).selectedIndex = selectedIndex;
		}
		else document.getElementById(msgEvent.message[0]).value = msgEvent.message[1];
	}
}

safari.self.addEventListener("message", getMessage, false);

if (document.URL == "http://openradar.appspot.com/myradars/add") fillContent(); //In OpenRadar bug reporter
else if (document.URL.indexOf("http://openradar.appspot.com/") != -1) addDuplicateButton(); //In OpenRadar, in description page
else if (document.title.indexOf("New Problem") != -1) safari.self.tab.dispatchMessage("getOpenRadarValue", "wantsDuplicateRadar"); //In Apple bug reporter, in "New Problem" page.
else if (document.title.indexOf("Home") != -1) safari.self.tab.dispatchMessage("getOpenRadarValue", "wantsOpenRadar"); //In Apple bug reporter, in the submission confirmation.
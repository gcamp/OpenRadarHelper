var originalAction;

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
		else if (msgEvent.message[0] == "wantsUpdateRadar") {
			if (msgEvent.message[1] == "yes") {
				lookForRadarToUpdate();
			}
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
	else if (msgEvent.name == "update") {
		var allElements = document.getElementsByTagName("a");
		var aElement;
		
		for (aElement in allElements) {
			var ref = allElements[aElement].getAttribute("href");
			if (ref.indexOf("/radar?id=") === 0) {
					var radarNumber = msgEvent.message[1];
					if (allElements[aElement].innerHTML.indexOf(radarNumber) != -1 || radarNumber.indexOf(allElements[aElement].innerHTML) != -1) {					
						window.open('http://www.openradar.me/myradars/edit?id=' + ref.substring(10, ref.length), "new tab");
						break;
					}
			}
		}
	}
}

safari.self.addEventListener("message", getMessage, false);

if (document.URL == "http://openradar.appspot.com/myradars/add" || document.URL == "http://www.openradar.me/myradars/add") fillContent(); //In OpenRadar bug reporter
else if (document.URL == "http://openradar.appspot.com/myradars" || document.URL == "http://www.openradar.me/myradars") safari.self.tab.dispatchMessage("getOpenRadarValue", "wantsUpdateRadar"); //In OpenRadar bug reporter
else if (document.URL.indexOf("http://openradar.appspot.com/myradars/edit?id=") != -1 || document.URL.indexOf("http://www.openradar.me/myradars/edit?id=") != -1) fillUpdatedContent();
else if (document.URL.indexOf("http://openradar.appspot.com") != -1 || document.URL.indexOf("http://www.openradar.me") != -1) addDuplicateButton(); //In OpenRadar, in description page
else if (document.title.indexOf("New Problem") != -1) safari.self.tab.dispatchMessage("getOpenRadarValue", "wantsDuplicateRadar"); //In Apple bug reporter, in "New Problem" page.
else if (document.title.indexOf("Home") != -1) safari.self.tab.dispatchMessage("getOpenRadarValue", "wantsOpenRadar"); //In Apple bug reporter, in the submission confirmation.
else if (document.title.indexOf("Apple Bug Reporter - ") != -1) addUpdateButton(); //In Apple bug reporter, looking at a existing bug report
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

function clearDuplicateContent() {
	//Clear the data after submission
	safari.self.tab.dispatchMessage("probDescID", null);
	safari.self.tab.dispatchMessage("probTitleNewProb", null);
	safari.self.tab.dispatchMessage("prodList", null);
	safari.self.tab.dispatchMessage("version", null);
	safari.self.tab.dispatchMessage("classList", null);
	safari.self.tab.dispatchMessage("reproducibleNewProb", null);
	safari.self.tab.dispatchMessage("wantsDuplicateRadar", null);
}
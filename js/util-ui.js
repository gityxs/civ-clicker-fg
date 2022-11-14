(function() {
    
	var ui = {
        
		findAll: function(selector) {
            
			if (typeof selector === 'string') { return document.querySelectorAll(selector) }
            else { return undefined }			
		},
        
		find: function(selector) {
            
			if (typeof selector === 'string') { return document.querySelectorAll(selector)[0] }
            else if (typeof selector === 'object') { return selector }
            else { return undefined }
		},
        
		show: function(selector, visible) {

			let elt = ui.find(selector)
			if (!elt) { return undefined }

			if (visible === undefined) { visible = (elt.style.display == "none") }

			let tagName = elt.tagName.toLowerCase()

			let displayVal = "initial"
            if (tagName == "button") displayVal = "inline-block"
            else if (tagName == "div") displayVal = "block"
            
			if (!visible) { displayVal = "none" }
			elt.style.display = displayVal
		},
	}

	if (window) { window.ui = ui }
    else { console.error("ui instantiation failed") }

})()
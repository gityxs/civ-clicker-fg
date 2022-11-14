(function() {

	var ajax = {
        
        get: function(url, callback) {
            
            let req = new XMLHttpRequest()
            req.onreadystatechange = function() {
                if (req.readyState == XMLHttpRequest.DONE) {
                    if (req.status == 200) {
                        
                        let response = JSON.parse(req.responseText)
                        callback(req.responseText, response)
                    }
                    else if (req.status == 400) { console.error("Ajax 400 error", req) }
                    else { console.error("Ajax non-200 error", req) }
                }
            }

            req.open("GET", url, true)
            req.send()
        },
    }

	if (window) { window.ajax = ajax }
    else { console.error("ajax instantiation failed") }
    
})()
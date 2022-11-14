//---
function isValid(variable) { return (variable !== null) && (variable !== undefined) && (variable === variable) }

//---
function valOf(variable) { 

    if (typeof variable == "function") { return variable.apply(this, Array.prototype.slice.call(arguments, 1)) }
    else { return variable }
}

//---
function calcArithSum(incr, n, m) {

    if (m === undefined) { m = n + 1 }
    return (m - n) * ((n * incr) + ((m - 1) * incr)) / 2
}

//---
function logSearchFn(func, limitY) {
    
    let minX = 0, maxX = 0, curX = 0,  curY

    while ((curY = func(maxX)) <= limitY) {
        
        minX = maxX
        maxX = maxX ? maxX * 2 : (maxX + 1)
    }

    while (maxX - minX > 1) {
        
        curX = Math.floor((maxX + minX) / 2)
        curY = func(curX)

        if (curY <= limitY) { minX = curX }
        else { maxX = curX }
    }

    return minX
}

//---
function mergeObj(o1, o2) {

    if (o2 === undefined) { return o1 }

    if ((typeof(o2) != "object") || (o1 === null) || (typeof(o1) != "object") || (o2 === null)) {
        
        o1 = o2
        return o1
    }

    for (let i in o2) { if (o2.hasOwnProperty(i)) { o1[i] = mergeObj(o1[i], o2[i]) }}

    return o1
}

//---
function dataset(elem, attr, value) {
    
    if (value !== undefined) { return elem.setAttribute("data-" + attr, value) }

    let val = null
    for (let i = elem; i; i = i.parentNode) {
        
        if (i.nodeType != Node.ELEMENT_NODE) { continue }
        val = i.getAttribute("data-" + attr)
        if (val !== null) { break }
    }
    
    return (val == "true") ? true : (val == "false") ? false : val
}

//---
function rndRound(num) {
    
    let baseVal = Math.floor(num)
    return baseVal + ((Math.random() < (num - baseVal)) ? 1 : 0)
}

//---
function copyProps(dest, src, names, deleteOld) {
    
    if (!(names instanceof Array)) { names = Object.getOwnPropertyNames(src) }
    if (!isValid(deleteOld)) { deleteOld = false }

    names.forEach(elem => {
        
        if (!src.hasOwnProperty(elem)) { return }

        Object.defineProperty(dest,elem,Object.getOwnPropertyDescriptor(src, elem))
        if (deleteOld) { delete src[elem] }
    })
}

//---
function indexArrayByAttr(inArray, attr) {
    
    inArray.forEach(function(elem, ignore, arr) {

        if (isValid(elem[attr]) && !isValid(arr[elem[attr]])) { Object.defineProperty(arr, elem.id, { value:elem, enumerable:false }) }
        else { console.log("Duplicate or missing " + attr + " attribute in array: " + elem[attr]) }
    })
}
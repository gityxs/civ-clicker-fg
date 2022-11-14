//--- Base class
function CivObj(props, asProto) {
    
	if (!(this instanceof CivObj)) { return new CivObj(props) }
    
	let names = asProto ? null : [
		"id", "name", "subType", "owned", "prereqs", "require", "salable", "vulnerable",
        "effectText" ,"prestige", "initOwned", "init", "reset", "limit", "hasVariableCost",
	]
	Object.call(this,props)    
	copyProps(this, props, names, true)
    
	return this
}
//---
CivObj.prototype = {
    
	constructor: CivObj,
	subType: "normal",

	get data() { return curCiv[this.id] },
	set data(value) { curCiv[this.id] = value },

	get owned() { return this.data.owned },
	set owned(value) { this.data.owned = value },

	prereqs: {}, require: {},
	salable: false, vulnerable: true,
	effectText: "",
	
	initOwned: 0, prestige: false,
	init: function(fullInit) { 
    
		if (fullInit === undefined) { fullInit = true }

		if (fullInit || !this.prestige)  { 
			this.data = {}
			if (this.initOwned !== undefined) { this.owned = this.initOwned }
		} 
        
		return true
	},
	reset: function() { return this.init(false) },
    
	get limit() { return (typeof this.initOwned == "number" ) ? Infinity : (typeof this.initOwned == "boolean") ? true : 0 },

	hasVariableCost: function() { 

		let requireDesc = Object.getOwnPropertyDescriptor(this, "require")
		if (!requireDesc) { return false }
		if (requireDesc.get !== undefined) { return true }

		for (let i in this.require) {
            if (typeof this.require[i] == "function") { return true }
        }
        
		return false
	},

	getQtyName: function(qty) { 
    
		if (qty === 1 && this.singular) { return this.singular.charAt(0).toUpperCase() + this.singular.slice(1) }
		if (typeof qty == "number" && this.plural) { return this.plural.charAt(0).toUpperCase() + this.plural.slice(1) }
		return (this.name ? this.name.charAt(0).toUpperCase() + this.name.slice(1) : false) || this.singular.charAt(0).toUpperCase() + this.singular.slice(1) || "(UNNAMED)"
	}
}

//--- Resource class
function Resource(props) {
    
	if (!(this instanceof Resource)) { return new Resource(props) }

	CivObj.call(this, props)
	copyProps(this, props, null, true)

	return this
}
//---
Resource.prototype = new CivObj({
    
	constructor: Resource,
	type: "resource",
	
    increment: 0, specialChance: 0, specialMaterial: "", activity: "gathering",

	get net() { 
    
		if (typeof this.data.net !== "number") {
			console.warn(".net not a number")
			return 0
		}
        
		return this.data.net
	},    
	set net(value) { this.data.net = value },
    
}, true)

//--- Building class
function Building(props) {
    
	if (!(this instanceof Building)) { return new Building(props) }
    
	CivObj.call(this,props)
	copyProps(this, props, null, true)
    
	return this
}
//---
Building.prototype = new CivObj({

	constructor: Building,
	type: "building",
    
	alignment: "player", place: "home",
    
	get vulnerable() { return this.subType != "altar" },

}, true)

//--- Upgrade class
function Upgrade(props) {
    
	if (!(this instanceof Upgrade)) { return new Upgrade(props) }
    
	CivObj.call(this, props)
	copyProps(this, props, null, true)
    
	if (this.subType == "prayer") { this.initOwned = undefined }
	if (this.subType == "pantheon") { this.prestige = true }

	return this
}
//---
Upgrade.prototype = new CivObj({
    
	constructor: Upgrade,
	type: "upgrade",
    
	initOwned: false, vulnerable: false,
    
	get limit() { return 1 },

}, true)

//--- Unit class
function Unit(props) {
    
	if (!(this instanceof Unit)) { return new Unit(props) }
    
	CivObj.call(this, props)
	copyProps(this, props, null, true)

	return this
}
//---
Unit.prototype = new CivObj({
    
	constructor: Unit,
	type: "unit",
    
	salable: true, alignment: "player", species: "human", place: "home", combatType: "",  // Default noncombatant.  Also "infantry","cavalry","animal"
	
    onWin: function() { return },
    
	get vulnerable() { return this.place == "home" && this.alignment == "player" && this.subType == "normal" },

	get isPopulation() {
        
		if (this.alignment != "player") { return false }
        else if (this.subType == "special" || this.species == "mechanical") { return false }
        
        return true
	},

	init: function(fullInit) {

		CivObj.prototype.init.call(this, fullInit)

		if (this.vulnerable && (this.species=="human")) { this.illObj = { owned: 0 } }
        
		return true
	},

	get illObj() { return curCiv[this.id + "Ill"] },
	set illObj(value) { curCiv[this.id + "Ill"] = value },
    
	get ill() { return isValid(this.illObj) ? this.illObj.owned : undefined },
	set ill(value) { if (isValid(this.illObj)) { this.illObj.owned = value } },
    
	get partyObj() { return civData[this.id + "Party"] },

	get party() { return isValid(this.partyObj) ? this.partyObj.owned : undefined },
	set party(value) { if (isValid(this.partyObj)) { this.partyObj.owned = value } },

	isDest: function() { return this.source !== undefined && curCiv[this.source].partyObj === this },
    
	get limit() { return this.isDest() ? curCiv[this.source].limit : Object.getOwnPropertyDescriptor(CivObj.prototype, "limit").get.call(this) },

	get total() { return this.isDest() ? curCiv[this.source].total : this.owned + (this.ill || 0) + (this.party || 0) },

}, true)

//--- Achievement class
function Achievement(props) {
    
	if (!(this instanceof Achievement)) { return new Achievement(props) }

	CivObj.call(this, props)
	copyProps(this, props, null, true)

	return this
}
//---
Achievement.prototype = new CivObj({
    
	constructor: Achievement,
	type: "achievement",
    
	initOwned: false, prestige : true, vulnerable : false,
    
	get limit() { return 1 },

}, true)
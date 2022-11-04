//---
function CivObj(props, asProto) {
    
	if (!(this instanceof CivObj)) { return new CivObj(props) }
    
	var names = asProto ? null : [
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
    
	get limit() { return (typeof this.initOwned == "number" ) ? Infinity : (typeof this.initOwned == "boolean") ? true : 0; },

	hasVariableCost: function() { 

		var requireDesc = Object.getOwnPropertyDescriptor(this, "require")
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

//---
function Resource(props)
{
	if (!(this instanceof Resource)) { return new Resource(props) }

	CivObj.call(this, props)
	copyProps(this, props, null, true)

	return this
}
//---
Resource.prototype = new CivObj({
    
	constructor: Resource,
	type: "resource",

	get net() { 
    
		if (typeof this.data.net !== "number") {
			console.warn(".net not a number")
			return 0
		}
        
		return this.data.net
	},    
	set net(value) { this.data.net = value; },
	
    increment: 0, specialChance: 0, specialMaterial: "", activity: "gathering",
    
}, true)

function Building(props) // props is an object containing the desired properties.
{
	if (!(this instanceof Building)) { return new Building(props); } // Prevent accidental namespace pollution
	CivObj.call(this,props);
	copyProps(this,props,null,true);
	// Occasional Properties: subType, efficiency, devotion
	// plural should get moved during I18N.
	return this;
}
// Common Properties: type="building",customQtyId
Building.prototype = new CivObj({
	constructor: Building,
	type: "building",
	alignment:"player",
	place: "home",
	get vulnerable() { return this.subType != "altar"; }, // Altars can't be sacked.
	set vulnerable(value) { return this.vulnerable; }, // Only here for JSLint.
	customQtyId: "buildingCustomQty"
},true);

function Upgrade(props) // props is an object containing the desired properties.
{
	if (!(this instanceof Upgrade)) { return new Upgrade(props); } // Prevent accidental namespace pollution
	CivObj.call(this,props);
	copyProps(this,props,null,true);
	// Occasional Properties: subType, efficiency, extraText, onGain
	if (this.subType == "prayer") { this.initOwned = undefined; } // Prayers don't get initial values.
	if (this.subType == "pantheon") { this.prestige = true; } // Pantheon upgrades are not lost on reset.
	return this;
}
// Common Properties: type="upgrade"
Upgrade.prototype = new CivObj({
	constructor: Upgrade,
	type: "upgrade",
	initOwned: false,
	vulnerable: false,
	get limit() { return 1; }, // Can't re-buy these.
	set limit(value) { return this.limit; } // Only here for JSLint.
},true);

function Unit(props) // props is an object containing the desired properties.
{
	if (!(this instanceof Unit)) { return new Unit(props); } // Prevent accidental namespace pollution
	CivObj.call(this,props);
	copyProps(this,props,null,true);
	// Occasional Properties: singular, plural, subType, prereqs, require, effectText, alignment,
	// source, efficiency_base, efficiency, onWin, lootFatigue, killFatigue, killExhaustion, species
	// place, ill
	return this;
}
// Common Properties: type="unit"
Unit.prototype = new CivObj({
	constructor: Unit,
	type: 			"unit",
	salable: 		true,
	get customQtyId() { 
		return this.place + "CustomQty"; 
	},
	set customQtyId(value) { 
		return this.customQtyId; 
	}, // Only here for JSLint.
	alignment: 		"player", // Also: "enemy"
	species: 		"human", // Also:  "animal", "mechanical", "undead"
	place: 			"home", // Also:  "party"
	combatType: 	"",  // Default noncombatant.  Also "infantry","cavalry","animal"
	onWin: function() { return; }, // Do nothing.
	get vulnerable() { 
		return ((this.place == "home")&&(this.alignment=="player")&&(this.subType=="normal")); 
	},
	set vulnerable(value) { 
		return this.vulnerable; 
	}, // Only here for JSLint.
	get isPopulation () {
		if (this.alignment != "player") { 
			return false; 
		} else if (this.subType == "special" || this.species == "mechanical") { 
			return false;
		} else {
			//return (this.place == "home")
			return true;
		}
	},
	set isPopulation (v) {
		return this.isPopulation;
	},
	init: function(fullInit) { 
		CivObj.prototype.init.call(this,fullInit);
		// Right now, only vulnerable human units can get sick.
		if (this.vulnerable && (this.species=="human")) {
			this.illObj = { owned: 0 };
		} 
		return true; 
	},
	//xxx Right now, ill numbers are being stored as a separate structure inside curCiv.
	// It would probably be better to make it an actual 'ill' property of the Unit.
	// That will require migration code.
	get illObj() { 
		return curCiv[this.id+"Ill"]; 
	},
	set illObj(value) { 
		curCiv[this.id+"Ill"] = value; 
	}, 
	get ill() { 
		return isValid(this.illObj) ? this.illObj.owned : undefined; 
	},
	set ill(value) { 
		if (isValid(this.illObj)) { this.illObj.owned = value; } 
	},
	get partyObj() { 
		return civData[this.id+"Party"]; 
	},
	set partyObj(value) { 
		return this.partyObj; 
	}, // Only here for JSLint.
	get party() { 
		return isValid(this.partyObj) ? this.partyObj.owned : undefined; 
	},
	set party(value) { 
		if (isValid(this.partyObj)) { 
			this.partyObj.owned = value; 
		} 
	},
	// Is this unit just some other sort of unit in a different place (but in the same limit pool)?
	isDest: function() { 
		return (this.source !== undefined) && (civData[this.source].partyObj === this); 
	},
	get limit() { 
		return (this.isDest()) ? civData[this.source].limit 
											 : Object.getOwnPropertyDescriptor(CivObj.prototype,"limit").get.call(this); 
	},
	set limit(value) { 
		return this.limit; 
	}, // Only here for JSLint.

	// The total quantity of this unit, regardless of status or place.
	get total() { 
		return (this.isDest()) ? civData[this.source].total : (this.owned + (this.ill||0) + (this.party||0)); 
	},
	set total(value) { 
		return this.total; 
	} // Only here for JSLint.
},true);

function Achievement(props) // props is an object containing the desired properties.
{
	if (!(this instanceof Achievement)) { 
		// Prevent accidental namespace pollution
		return new Achievement(props); 
	} 
	CivObj.call(this,props);
	copyProps(this,props,null,true);
	// Occasional Properties: test
	return this;
}
// Common Properties: type="achievement"
Achievement.prototype = new CivObj({
	constructor: Achievement,
	type: "achievement",
	initOwned: false,
	prestige : true, // Achievements are not lost on reset.
	vulnerable : false,
	get limit() { 		return 1; }, // Can't re-buy these.
	set limit(value) { 	return this.limit; } // Only here for JSLint.
},true);
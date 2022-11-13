//========== VARIABLES

var saveTag = "civ"
var saveSettingsTag = "civSettings"

var logRepeat = 1

var civSizes = [
	{ min_pop:      0, name: "Thorp",        id: "thorp"       },
	{ min_pop:     20, name: "Hamlet",       id: "hamlet"      },
	{ min_pop:     60, name: "Village",      id: "village"     },
	{ min_pop:    200, name: "Small Town",   id: "smallTown"   },
	{ min_pop:   2000, name: "Large Town",   id: "largeTown"   },
	{ min_pop:   5000, name: "Small City",   id: "smallCity"   },
	{ min_pop:  10000, name: "Large City",   id: "largeCity"   },
	{ min_pop:  20000, name: "Metropolis",   id: "metropolis"  },
	{ min_pop:  50000, name: "Small Nation", id: "smallNation" },
	{ min_pop: 100000, name: "Nation",       id: "nation"      },
	{ min_pop: 200000, name: "Large Nation", id: "largeNation" },
	{ min_pop: 500000, name: "Empire",       id: "empire"      }
]

var PATIENT_LIST = [
	"healer", "cleric", "farmer", "soldier", "cavalry", "labourer",
	"woodcutter", "miner", "tanner", "blacksmith", "unemployed"
]

var curCiv = {
    
	civName: "Freddec Games",
	rulerName: "Freddec",

	zombie: { owned:0 },
	grave: { owned:0 },
	enemySlain: { owned:0 },
	morale: { mod:1.0, efficiency:1.0 },

	resourceClicks: 0,
	attackCounter: 0,

	trader: { materialId: "", requested: 0, timer: 0, counter: 0 },

	raid: { raiding: false, victory: false, epop: 0, plunderLoot: {}, last: "", targetMax: civSizes[0].id },

	curWonder: { name: "", stage: 0, progress: 0, rushed: false },
	wonders:[],

	deities : [ { name:"", domain:"", maxDev:0 } ],
}

var population = { current:	0, living: 0, limit: 0, healthy: 0, totalSick: 0 }

var civData = getCivData()

var settings = { autosave: true, autosaveCounter: 1, autosaveTime: 60 }

var resourceData = []
var buildingData = []
var upgradeData = []
var powerData = []
var unitData = []
var achData = []
var sackable = []
var lootable = []
var killable = []
var homeBuildings = []
var homeUnits = []
var armyUnits = []
var basicResources = []
var normalUpgrades = []

var wonderCount = {}
var wonderResources = getWonderResources(civData)

//========== USER ACTIONS

function onToggleAutosave(control) { return setAutosave(control.checked) }

function onReset() {

	let msg = "Really reset? You will keep past deities and wonders (and cats)"
	if (!confirm(msg)) { return false }

	civData.forEach(elem => { if (elem instanceof CivObj) { elem.reset() } })

	curCiv.zombie.owned = 0
	curCiv.grave.owned = 0
	curCiv.enemySlain.owned = 0
	curCiv.resourceClicks = 0
	curCiv.attackCounter = 0
	curCiv.morale = { mod: 1.0, efficiency: 1.0 }

	if (!curCiv.deities[0].maxDev) { curCiv.deities.shift() }
	curCiv.deities.unshift({ name:"", domain:"", maxDev:0 })

	population = { current:0, limit:0, healthy:0, totalSick:0 }

	resetRaiding()
	curCiv.raid.targetMax = civSizes[0].id
    
    curCiv.trader = { materialId:"", requested:0, timer:0, counter:0 }
	curCiv.curWonder = { name:"", stage:0, progress:0, rushed:false }

	updateAfterReset()
	gameLog("Game Reset")

	renameCiv()
	renameRuler()
}

function renameDeity(newName) {
    
    let i = false
	while (!newName) {

		newName = prompt("Whom do your people worship?", (newName || curCiv.deities[0].name || curCiv.rulerName))
		if (newName === null && curCiv.deities[0].name) { return }

		i = haveDeity(newName)
		if (i && curCiv.deities[0].name) {
            
			alert("That deity already exists.")
			newName = ""
		}
	}

	curCiv.deities[0].name = newName

	if (i) {
        
		curCiv.deities[0] = curCiv.deities[i]
		curCiv.deities.splice(i, 1)
		if (getCurDeityDomain()) { selectDeity(getCurDeityDomain(), true)}
	}

	makeDeitiesTables()
}

function renameRuler(newName) {
    
	if (curCiv.rulerName == "Cheater") { return }

	while (!newName || haveDeity(newName) !== false) {
        
		newName = prompt("What is your name?", (newName || curCiv.rulerName || "Freddec"))
		if (newName === null && curCiv.rulerName) { return }
        
		if (haveDeity(newName) !== false) {
            
			alert("That would be a blasphemy against the deity " + newName + ".");
			newName = ""
		}
	}

	curCiv.rulerName = newName

	ui.find("#rulerName").innerHTML = curCiv.rulerName
}

function renameCiv(newName) {

	while (!newName) {
        
		newName = prompt("Please name your civilization", (newName || curCiv.civName || "Freddec Games"))
		if (newName === null && curCiv.civName) { return }
	}

	curCiv.civName = newName
	ui.find("#civName").innerHTML = curCiv.civName
}

function deleteSave() {

	if (!confirm("All progress and achievements will be lost.\nReally delete save?")) { return }

    localStorage.removeItem(saveTag)
    localStorage.removeItem(saveSettingsTag)
    
    gameLog("Save Deleted")
    
    if (confirm("Save Deleted. Refresh page to start over?")) { window.location.reload() }
}

function importByInput(elt) {

	let compressed = elt.value
	let decompressed = LZString.decompressFromBase64(compressed)
	let revived = JSON.parse(decompressed)

	let loadVar = revived[0]
	if (!loadVar) {
        
		console.log("Unable to parse saved game string.")
		return false
	}

	gameLog("Imported saved game")

	return loadVar
}

function startWonder() {
    
	if (curCiv.curWonder.stage !== 0) { return }
	++curCiv.curWonder.stage

	updateWonder()
}

function wonderSelect(resourceId) {
    
	if (curCiv.curWonder.stage !== 2) { return }
    
	++curCiv.curWonder.stage
	++curCiv.curWonder[resourceId]

	gameLog("You now have a permanent bonus to " + resourceId + " production.")

	curCiv.wonders.push({name: curCiv.curWonder.name, resourceId: resourceId})
    
	curCiv.curWonder.name = ""
	curCiv.curWonder.progress = 0

	updateWonder()
}

function speedWonder() {
    
	if (civData.gold.owned < 100) { return }
	civData.gold.owned -= 100

	curCiv.curWonder.progress += 1 / getWonderCostMultiplier()
	curCiv.curWonder.rushed = true
    
	updateWonder()
}

function selectDeity(domain, force) {
    
	if (!force) {
        
		if (civData.piety.owned < 500) { return }
		civData.piety.owned -= 500
	}
    
	curCiv.deities[0].domain = domain

	makeDeitiesTables()
	updateUpgrades()
}

function grace() {
    
	if (civData.piety.owned >= civData.grace.cost) {
        
		civData.piety.owned -= civData.grace.cost
		civData.grace.cost = Math.floor(civData.grace.cost * 1.2)
		ui.find("#graceCost").innerHTML = '<div class="col-auto"><img src="img/piety.png" class="icon-sm" alt="Piety" data-bs-toggle="tooltip" data-bs-title="Piety"> ' + prettify(civData.grace.cost) + '</div>'
        
		adjustMorale(0.1)
        
		updateResourceTotals()
		updateMorale()
	}
}

function glory(time) {
    
	if (time === undefined) { time = 180 }
	if (!payFor(civData.glory.require)) { return }

	civData.glory.timer = time

	ui.find("#gloryTimer").innerHTML = civData.glory.timer
	ui.find("#gloryGroup").style.display = "block"
}

function smite() {
    
	smiteMob(civData.barbarian)
	smiteMob(civData.bandit)
	smiteMob(civData.wolf)

	updateResourceTotals()
	updateJobButtons()
}

function pestControl(length) {
    
	if (length === undefined) { length = 10 }
	if (civData.piety.owned < 10 * length) { return }
    
	civData.piety.owned -= 10 * length
	civData.pestControl.timer = length * civData.cat.owned
    
	gameLog("The vermin are exterminated.")
}

function walk(increment) {
    
	if (increment === undefined) { increment = 1 }
    
	if (increment === false) {
        
        increment = 0
        civData.walk.rate = 0
    }

	civData.walk.rate += increment

	ui.find("#walkStat").innerHTML = prettify(civData.walk.rate)
	ui.find("#ceaseWalk").disabled = civData.walk.rate === 0
	ui.show("#walkGroup", civData.walk.rate > 0)
}

function wickerman() {

	let job = getRandomHealthyWorker()
	if (!job) { return }

	if (!payFor(civData.wickerman.require)) { return }

	--civData[job].owned
    
	calculatePopulation()

	let rewardObj = lootable[Math.floor(Math.random() * lootable.length)]
	let qty = Math.floor(Math.random() * 1000)
	if (rewardObj.id == "wood") { qty = (qty / 2) + 500 }
	rewardObj.owned += qty

	function getRewardMessage(rewardObj) {
        switch(rewardObj.id) {
            
            case "food"   :  return "The crops are abundant!"
            case "wood"   :  return "The trees grow stout!"
            case "stone"  :  return "The stone splits easily!"
            case "skins"  :  return "The animals are healthy!"
            case "herbs"  :  return "The gardens flourish!"
            case "ore"    :  return "A new vein is struck!"
            case "leather":  return "The tanneries are productive!"
            case "metal"  :  return "The steel runs pure."
            default       :  return "You gain " + rewardObj.getQtyName(qty) + "!"
        }
    }

	gameLog("Burned a " + civData[job].getQtyName(1) + ". " + getRewardMessage(rewardObj))
    
	updateResourceTotals()
	updatePopulation()
}

function summonShade() {
    
	if (curCiv.enemySlain.owned <= 0) { return 0 }
	if (!payFor(civData.summonShade.require)) { return 0 }

	let num = Math.ceil(curCiv.enemySlain.owned / 4 + (Math.random() * curCiv.enemySlain.owned / 4))
	curCiv.enemySlain.owned -= num
	civData.shade.owned += num

	return num
}

function raiseDead(num) {
    
	if (num === undefined) { num = 1 }

	num = Math.min(num, civData.corpse.owned)
	num = Math.max(num, -curCiv.zombie.owned)
	num = Math.min(num, logSearchFn(calcZombieCost, civData.piety.owned))

	civData.piety.owned -= calcZombieCost(num)
	curCiv.zombie.owned += num
	civData.corpse.owned -= num

	if      (num ==  1) { gameLog("A corpse rises, eager to do your bidding.") } 
	else if (num  >  1) { gameLog("The corpse rise, eager to do your bidding.") }
	else if (num == -1) { gameLog("A zombie crumples to the ground, inanimate.") }
	else if (num  < -1) { gameLog("The zombies fall, mere corpse once again.") }

	calculatePopulation()
    
	updatePopulation()
	updateResourceTotals()

	return num
}

function iconoclasm(index) {

	ui.find("#iconoclasmList").innerHTML = ""
	ui.find("#iconoclasm").disabled = false
    
	if (index == "cancel" || index >= curCiv.deities.length) {

		civData.piety.owned += 1000
		return
	} 

	civData.gold.owned += Math.floor(Math.pow(curCiv.deities[index].maxDev, 1 / 1.25))

	curCiv.deities.splice(index, 1)

	makeDeitiesTables()
}

function invade(control) {
    
    let ecivtype = dataset(control, "target")
    
	curCiv.raid.raiding = true
	curCiv.raid.last = ecivtype
    
	curCiv.raid.epop = civSizes[ecivtype].max_pop + 1
	if (curCiv.raid.epop === Infinity ) { curCiv.raid.epop = civSizes[ecivtype].min_pop * 2 }
	if (civData.glory.timer > 0) { curCiv.raid.epop *= 2 }

	civData.esoldier.owned += (curCiv.raid.epop / 20) + Math.floor(Math.random() * (curCiv.raid.epop / 5))
	civData.efort.owned += Math.floor(Math.random() * (curCiv.raid.epop / 5000))

	let baseLoot = curCiv.raid.epop / (1 + (civData.glory.timer <= 0))

	curCiv.raid.plunderLoot = { freeLand: Math.round(baseLoot * (1 + civData.administration.owned)) }
	lootable.forEach(elem => { curCiv.raid.plunderLoot[elem.id] = Math.round(baseLoot * Math.random()) })

	ui.show("#raidNews", false)
    
	updateTargets()
    
	armyUnits.forEach(elem => { updatePurchaseRow(elem) })
}

function plunder() {
    
	let plunderMsg = ""
	let raidNewsElt = ui.find("#raidNews")

	if ((curCiv.raid.targetMax != civSizes[civSizes.length - 1].id) && curCiv.raid.last == curCiv.raid.targetMax) {
		curCiv.raid.targetMax = civSizes[civSizes[curCiv.raid.targetMax].idx + 1].id
	}

	adjustMorale((civSizes[curCiv.raid.last].idx + 1) / 100)

	if (civData.lament.owned) { curCiv.attackCounter -= Math.ceil(curCiv.raid.epop / 2000) }

	payFor(curCiv.raid.plunderLoot, -1)

	plunderMsg = civSizes[curCiv.raid.last].name + " defeated!"
	gameLog(plunderMsg)
    
	plunderMsg += "Plundered <div class='row gx-2'>" + getCostHtml(curCiv.raid.plunderLoot) + "</div>"
	raidNewsElt.innerHTML = "Results of last raid: " + plunderMsg
	ui.show(raidNewsElt, true)
	resetRaiding()
    
	updateResourceTotals()
	updateTargets()
}

function trade() {

	if (!curCiv.trader.materialId || (civData[curCiv.trader.materialId].owned < curCiv.trader.requested)) {
        
		gameLog("Not enough resources to trade.")
		return
	}

	let material = civData[curCiv.trader.materialId]

	material.owned -= curCiv.trader.requested
	++civData.gold.owned

	updateResourceTotals()
    
	gameLog("Traded " + curCiv.trader.requested + " " + material.getQtyName(curCiv.trader.requested))
}

function buy(materialId) {
    
	let material = civData[materialId]
	if (civData.gold.owned < 1) { return }
	--civData.gold.owned

	if (material == civData.food    || material == civData.wood  || material == civData.stone) { material.owned += 5000 }
	if (material == civData.skins   || material == civData.herbs || material == civData.ore)   { material.owned +=  500 }
	if (material == civData.leather || material == civData.metal)                              { material.owned +=  250 }

	updateResourceTotals()
}

function spawn(num) {
    
	num = Math.max(num, -civData.unemployed.owned)
	num = Math.min(num, logSearchFn(calcWorkerCost,civData.food.owned))
	num = Math.min(num, (population.limit - population.living))

	civData.food.owned -= calcWorkerCost(num)
    civData.unemployed.owned += num
    
	calculatePopulation()

	if (Math.random() * 100 < 1 + (civData.lure.owned)) {
        
        ++civData.cat.owned
        gameLog("Found a cat!")
    }

	updateResourceTotals()
	updatePopulation()
}

function purchase(control) { 

	let objId = dataset(control, "target")
	if (objId === null) { return 0 }    
	let purchaseObj = civData[objId]
	if (!purchaseObj) { return 0 }

	let num = dataset(control, "quantity")
	if (num === null) { return 0 }

	num = canPurchase(purchaseObj, num)
	num = payFor(purchaseObj.require, num)

	purchaseObj.owned = purchaseObj.owned + num
	if (purchaseObj.source) { civData[purchaseObj.source].owned -= num }

	if (isValid(purchaseObj.onGain)) { purchaseObj.onGain(num) }

	if (isValid(purchaseObj.devotion)) {
        
		civData.devotion.owned += purchaseObj.devotion * num

		if (curCiv.deities[0].maxDev < civData.devotion.owned) {
            
			curCiv.deities[0].maxDev = civData.devotion.owned
			makeDeitiesTables()
		}
	}

	if (purchaseObj.type == "building") {
        
		civData.freeLand.owned -= num

		if (civData.freeLand.owned < 0) {
            
			gameLog("You are suffering from overcrowding.")
			adjustMorale(Math.max(num, -civData.freeLand.owned) * -0.0025 * (civData.codeoflaws.owned ? 0.5 : 1.0))
		}
	}

	updateRequirements(purchaseObj)
	updateResourceTotals()
	updatePopulation()
    
	homeBuildings.forEach(elem => { updatePurchaseRow(elem) })
	homeUnits.forEach(elem => { updatePurchaseRow(elem) })
    armyUnits.forEach(elem => { updatePurchaseRow(elem) })
    
	updateUpgrades()
	updateDevotion()
	updateTargets()

	return num
}

function increment(control) {
    
    let objId = dataset(control, "target")
    if (objId === null) { return }
    
	let purchaseObj = civData[objId]
	if (!purchaseObj) { return }
    
	let numArmy = 0
	unitData.forEach(elem => { 
		if (elem.alignment == "player" && elem.species=="human" && elem.combatType && elem.place == "home") { 
			numArmy += elem.owned
		} 
	})

	purchaseObj.owned +=
         purchaseObj.increment 
	  + (purchaseObj.increment * 9 * (civData.civilservice.owned)) 
	  + (purchaseObj.increment * 40 * (civData.feudalism.owned)) 
	  + ((civData.serfs.owned) * Math.floor(Math.log(civData.unemployed.owned * 10 + 1))) 
	  + ((civData.nationalism.owned) * Math.floor(Math.log(numArmy * 10 + 1)))

	let specialChance = purchaseObj.specialChance
	if (specialChance && purchaseObj.specialMaterial && civData[purchaseObj.specialMaterial]) {
        
		if ((purchaseObj === civData.food) && (civData.flensing.owned)) { specialChance += 0.1 }
		if ((purchaseObj === civData.stone) && (civData.macerating.owned)) { specialChance += 0.1 }
		if (Math.random() < specialChance) {
            
			let specialMaterial = civData[purchaseObj.specialMaterial]
			let specialQty =  purchaseObj.increment * (1 + (9 * (civData.guilds.owned)))
			specialMaterial.owned += specialQty
            
			gameLog("<span class='text-success'>Found " + specialMaterial.getQtyName(specialQty) + " while " + purchaseObj.activity + "</span>")
		}
	}

	if (purchaseObj.owned > purchaseObj.limit) { purchaseObj.owned = purchaseObj.limit }

	ui.find("#clicks").innerHTML = prettify(Math.round(++curCiv.resourceClicks))
    
	updateResourceTotals()
}

//========== UI functions

function getDeityRowText(deityId, deityObj) {
    
	if (!deityObj) { deityObj = { name:"No deity", domain:"", maxDev:0 } }

	return (""
        + "<div id='" + deityId + "' class='col-12'>"
            + "<div class='row gx-2 align-items-center' style='height:25px;'>"
                + "<div class='col'><strong><span id='" + deityId + "Name'>" + deityObj.name + "</span></strong></div>"
                + "<div class='col-auto'><span id=" + deityId + "Domain' class='deityDomain'>" + idToType(deityObj.domain) + "</span></div>"
                + "<div class='col-auto text-end' style='width:125px;'><span id='" + deityId + "Devotion'>" + deityObj.maxDev + "</span> Devotion</div>"
            + "</div>"
        + "</div>"
    )
}

function addWonderSelectText() {
    
	let html = ui.find("#wonderCompletedBonuses").innerHTML;
	wonderResources.forEach(elem => {
		html += "<div class='col-2'><button class='w-100 text-capitalize' onmousedown='wonderSelect(\"" + elem.id + "\")'>" + elem.getQtyName(0) + "</button></div>"
	})
	
	ui.find("#wonderCompletedBonuses").innerHTML = html
}

function addRaidRows() {
    
	let html = '<div class="row g-1">'
	civSizes.forEach(elem => {    
		html += "<div class='col-3'><button class='raid w-100' data-action='raid' data-target='" + elem.id + "' disabled='disabled'>" + elem.name + "</button></div>"
	})
    html += '</div>'

	ui.find("#raidGroup").innerHTML += html
	ui.find("#raidGroup").onmousedown = onBulkEvent
}

function addAchievementRows() {
    
	let html = '<div class="row g-1">'
	achData.forEach(elem => { 
		html += (''
            + '<div id="' + elem.id + '" class="col-12">'
                + '<div class="row gx-2 align-items-center" style="height:25px;">'
                    + '<div class="col"><strong>' + elem.getQtyName() + '</strong></div>'
                    + '<div class="col-auto">' + elem.effectText + '</div>'
                    + '<div class="col-auto"><i class="fas fa-fw fa-check-circle text-success"></i></div>'
                + '</div>'
            + '</div>'
        )
	})
    html += '</div>'
    
	ui.find("#achievements").innerHTML += html
}

function addUpgradeRows() {

	upgradeData.forEach(elem => {
        
		if (elem.subType == "upgrade") { return }
		if (elem.subType == "pantheon") { setPantheonUpgradeRowText(elem) }
		else {
            
			let htmlElem = document.getElementById(elem.id + "Row")
			htmlElem.innerHTML = getUpgradeRowHtml(elem)
			htmlElem.onmousedown = onBulkEvent
		}
	})

	buildingData.forEach(elem => { if (elem.subType == "altar") { setPantheonUpgradeRowText(elem) } })
	powerData.forEach(elem => { if (elem.subType == "prayer") { setPantheonUpgradeRowText(elem) } })

	let standardUpgStr = "", pantheonUpgStr = ""

	upgradeData.forEach(upgradeObj => {
        
		let html = "<div id='P" + upgradeObj.id + "' class='col-12' style='display:none;'><div class='row gx-2 align-items-center'>"
			+ "<div class='col'><strong>" + upgradeObj.getQtyName() + "</strong></div>"
			+ "<div class='col-auto text-end'>" + upgradeObj.effectText + "</div></div></div>"
            
		if (upgradeObj.subType == "pantheon") { pantheonUpgStr += html }
		else { standardUpgStr += html }
	})
    
	ui.find("#purchasedUpgrades").innerHTML += standardUpgStr
	ui.find("#purchasedPantheon").innerHTML = pantheonUpgStr
}

function setPantheonUpgradeRowText(upgradeObj) {
    
	if (!upgradeObj) { return null }
    
	let elem = document.getElementById(upgradeObj.id + "Row")
	elem.innerHTML = getPantheonUpgradeRowText(upgradeObj)
}

function getPantheonUpgradeRowText(upgradeObj) {
    
	if (!upgradeObj) { return "" }
    
	return (""
        + "<div class='row gx-2 align-items-center' style='height:25px;'>"
            + '<div class="col-auto">'
                + '<div class="dropdown">'
                    + '<a href="#" class="text-muted" data-bs-toggle="dropdown"><i class="fas fa-fw fa-info-circle"></i></a>'
                    + '<div class="dropdown-menu" style="min-width:max-content;">' + upgradeObj.effectText + '</div>'
                + '</div>'
            + '</div>'
            + "<div class='col'>"
                + "<button id='" + upgradeObj.id + "' class='xtrue' data-action='purchase' data-quantity='true' data-target='" + upgradeObj.id + "' disabled='disabled' onmousedown='" + ((upgradeObj.subType == "prayer") ? (upgradeObj.id + "()") : ("purchase(this)")) + "'>"
                    + upgradeObj.getQtyName()
                + "</button>"
            + "</div>"
            + (isValid(upgradeObj.extraText) ? "<div class='col-auto'>" + upgradeObj.extraText + "</div>" : "")
            + ((isValid(upgradeObj.require) && upgradeObj.require != {}) ? "<div class='col-auto'>" + getCostNote(upgradeObj) + "</div>" : "")
        + "</div>"
    )
}

function getCostHtml(costObj) {
    
	if (!isValid(costObj)) { return "" }

	let html = ""
	for (let costId in costObj) {

		let costCount = (typeof costObj[costId] == "function") ? costObj[costId](1) : costObj[costId]
		if (!costCount) { continue }
		html += "<div class='col-auto'><img src='img/" + costId + ".png' class='icon-sm' alt='" + civData[costId].getQtyName(costCount) + "' data-bs-toggle='tooltip' data-bs-title='" + civData[costId].getQtyName(costCount) + "' /> " + prettify(Math.round(costCount)) + "</div>"
	}

	return html
}

function getCostNote(objDef) {

	let costHtml = getCostHtml(objDef.require)
	return "<div id='" + objDef.id + "Cost' class='row gx-2 align-items-center justify-content-end cost'>" + costHtml + "</div>"
}

function getBasicResourceHtml(objDef) {

	let objId = objDef.id
	let objName = objDef.getQtyName(0)
    
	let txt = ( ''
		+ '<div class="col-12">'
            + '<div id="'+ objId + 'Row" class="row gx-2 align-items-center" data-target="'+ objId + '" style="height:30px;">'
                + '<div class="col-auto"><img src="img/' + objId + '.png" class="icon-lg" alt="' + objName + '" data-bs-toggle="tooltip" data-bs-title="' + objName + '" /></div>'
                + '<div class="col-auto" style="width:85px;"><button data-action="increment" class="w-100 text-capitalize">' + objDef.verb + '</button></div>'
                + '<div class="col"><span class="text-capitalize">' + objName + '</span></div>'
                + '<div class="col-auto"><span data-action="display"></span></div>'
                + '<div class="col-auto"><small id="max' + objId + '" class="opacity-50"></small></div>'
                + '<div class="col-auto text-end" style="width:85px;"><span data-action="displayNet"></span></div>'
            + '</div>'
		+ '</div>'
	)
	return txt
}

function sgnnum(x) { return (x > 0) ? 1 : (x < 0) ? -1 : 0 }
function sgnstr(x) { return (x.length === 0) ? 0 : (x[0] == "-") ? -1 : 1 }
function sgnbool(x) { return (x ? 1 : -1) }
function absstr(x) { return (x.length === 0) ? "" : (x[0] == "-") ? x.slice(1) : x }
function sgn(x) { return (typeof x == "number") ? sgnnum(x) : (typeof x == "string") ? sgnstr(x) : (typeof x == "boolean") ? sgnbool(x) : 0 }
function abs(x) { return (typeof x == "number") ? Math.abs(x) : (typeof x == "string") ? absstr(x) : x }

function getButtonPurchaseHtml(objDef, qty) {

	function sgnchr(x) { return (x > 0) ? '+' : (x < 0) ? '-' : '' }

	function infchr(x) { return (x == Infinity) ? '&infin;' : (x == 1000) ? '1k' : x }
    
	function fmtbool(x) {
        
		let neg = (sgn(x) < 0)
		return (neg ? '(' : '') + objDef.getQtyName(0) + (neg ? ')' : '')
	}
    
	function fmtqty(x) { return (typeof x == 'boolean') ? fmtbool(x) : sgnchr(sgn(x)) + infchr(abs(x)) }
    
	function allowPurchase() {

		if (objDef.alignment && (objDef.alignment != 'player')) { return false }

		if ((typeof objDef.initOwned == 'boolean') && abs(qty) > 1) { return false }

		if (sgn(qty) > 0 && objDef.require === undefined) { return false }
        
		if (sgn(qty) < 0 && !objDef.salable) { return false }

		if (qty != 1 && objDef.hasVariableCost()) { return false }

		return true
	}
    
    let txt = ''
	if (allowPurchase()) { 
		txt +='<button class="' + objDef.type + abs(qty) + '" data-quantity="' + qty + '" data-action="purchase" disabled="disabled">' + fmtqty(qty) + '</button>'
	}
    
	return txt
}

function getUpgradeRowHtml(objDef) {

	let txt = ( ''
        + '<div id="' + objDef.id + 'Row" data-target="' + objDef.id + '" class="col-12">'
            + '<div class="row gx-2 align-items-center" style="height:25px;">'
                + '<div class="col-auto">'
                    + '<div class="dropdown">'
                        + '<a href="#" class="text-muted" data-bs-toggle="dropdown"><i class="fas fa-fw fa-info-circle"></i></a>'
                        + '<div class="dropdown-menu" style="min-width:max-content;">' + objDef.effectText + '</div>'
                    + '</div>'
                + '</div>'
                + '<div class="col">' + getButtonPurchaseHtml(objDef, true) + '</div>'
                + '<div class="col-auto">' + getCostNote(objDef) + '</div>'
            + '</div>'
        + '</div>'
    )
	return txt
}

function getTextPurchaseHtml(objDef) {

	let objId = objDef.id
    
	let txt = '<div id="' + objId + 'Row" data-target="' + objId + '" class="col-12"><div class="row gx-2 align-items-center" style="height:25px;">'
    
    txt += ( ''
        + '<div class="col-auto">'
            + '<div class="dropdown">'
                + '<a href="#" class="text-muted" data-bs-toggle="dropdown"><i class="fas fa-fw fa-info-circle"></i></a>'
                + '<div class="dropdown-menu" style="min-width:max-content;">' + objDef.effectText + '</div>'
            + '</div>'
        + '</div>'
    )
    
	let enemyFlag = (objDef.alignment == 'enemy') ? ' text-danger' : ''
	txt += '<div class="col text-capitalize ' + enemyFlag + '">' + objDef.getQtyName(0) + '</div>'
    
    if (isValid(objDef.require) && objDef.require != {}) {
        txt += '<div class="col-auto">' + getCostNote(objDef) + '</div>'
    }
    
    if (isValid(objDef.require) && objDef.require != {}) {
        txt += '<div class="col-auto">'
        let tmp = [-Infinity, -100, -10, -1]
        tmp.forEach(function(elem) { txt += getButtonPurchaseHtml(objDef, elem) + ' ' })
        txt += '</div>'
    }
    
	let action = isValid(population[objId]) ? 'display_pop' : 'display'
	txt += '<div class="col-auto text-end" style="width:50px;"><span data-action="' + action + '"></span></div>'

    if (isValid(objDef.require) && objDef.require != {}) {
        txt += '<div class="col-auto">'
        let tmp = [1, 10, 100, (objDef.salable ? Infinity : 1000)]
        tmp.forEach(function(elem) { txt += getButtonPurchaseHtml(objDef, elem) + ' ' })
        txt += '</div>'
    }

	txt += '</div></div>'
    
	return txt
}

function addUITable(civObjs, groupElemName) {
    
	let html = ''
	civObjs.forEach(elem => { 
		html += elem.type == "resource" ? getBasicResourceHtml(elem) : elem.type == "upgrade"  ? getUpgradeRowHtml(elem) : getTextPurchaseHtml(elem)
	})
    
	let groupElem = document.getElementById(groupElemName)
	groupElem.innerHTML += html
	groupElem.onmousedown = onBulkEvent
}

function onBulkEvent(e) {
	switch (dataset(e.target, "action")) {
        
		case "increment": increment(e.target); break;
		case "purchase": purchase(e.target); break;
		case "raid": invade(e.target); break;
        
        default: break;
	}
}

function iconoclasmList() {

	if (civData.piety.owned >= 1000) {
        
		civData.piety.owned -= 1000
        
		updateResourceTotals()
        
		ui.find("#iconoclasm").disabled = true
        
		let append = "<div class='row gx-2 align-items-center justify-content-end'>"
		for (let i = 1; i <curCiv.deities.length; ++i) {
            
			append += '<div class="col-auto"><button onclick="iconoclasm(' + i + ')">'
			append += curCiv.deities[i].name
			append += '</button></div>'
		}
		append += '<div class="col-auto"><button onclick=\'iconoclasm("cancel")\'>Cancel</button></div>'
        append += '</div>'
		ui.find("#iconoclasmList").innerHTML = append
	}
}

function makeDeitiesTables() {

	let html = ""
	curCiv.deities.forEach(function(elem, i) {
        
		if (i === 0) { return }
		html += getDeityRowText("deity" + i, elem)
	})
    
	ui.find("#oldDeities").innerHTML = html

	updateDeity()
}

function gameLog(message) {

	let d = new Date()
	let curTime = d.getHours() + ":" + ((d.getMinutes() < 10) ? "0": "") + d.getMinutes()

	if (ui.find("#logL").innerHTML != message) {
        
		logRepeat = 0

		let i = 7
		while (--i > 1) { ui.find("#log" + i).innerHTML = ui.find("#log" + (i - 1)).innerHTML }

		ui.find("#log1").innerHTML = (""
            + "<div class='row gx-2 align-items-center'>"
                + "<div class='col-auto' style='width:85px;'>" + ui.find("#logT").innerHTML + "</div>"
                + "<div class='col'>" + ui.find("#logL").innerHTML + "</div>"
                + "<div class='col-auto text-end' style='width:35px;'>" + ui.find("#logR").innerHTML + "</div>"
            + "</div>"
		)
	}

	let s = ""
    s += "<div class='row gx-2 align-items-center'>"
    s += "<div id='logT' class='col-auto' style='width:85px;'>" + curTime + "</div>"
    s += "<div id='logL' class='col'>" + message + "</div>"
	if (++logRepeat > 1) { s += "<div id='logR' class='col-auto text-end' style='width:35px;'>x" + logRepeat + "</div>" }
    else { s += "<div id='logR' class='col-auto text-end' style='width:35px;'></div>" }
    s += "</div>"
	ui.find("#log0").innerHTML = s
}

//========== SETUP

var setup = {}

setup.all = function() {
    
	setup.data()
	setup.civSizes()
    
	document.addEventListener("DOMContentLoaded", function(e) {
        
		setup.game()
		setup.loop()
	})
    
    window.onbeforeunload = () => { if (settings.autosave) { save("auto") } }
};

setup.data = function() {
    
	civData.forEach(elem => {
        
		if (!(elem instanceof CivObj)) { 
			console.error("Unknown type: ", elem)
			return
		}
        
		if (elem.type == "resource") {
            
			resourceData.push(elem)
			if (elem.vulnerable === true) { lootable.push(elem) }
			if (elem.subType == "basic") { basicResources.push(elem) } 
		}        
		else if (elem.type == "building") {
            
			buildingData.push(elem)
            
			if (elem.vulnerable === true) { sackable.push(elem) }
			if (elem.subType == "normal" || elem.subType == "land") { homeBuildings.push(elem) } 
		}
        else if (elem.type == "upgrade") {
            
            if (elem.subType == "prayer") { powerData.push(elem) }
			else {
                
                upgradeData.push(elem)
                if (elem.subType == "upgrade") { normalUpgrades.push(elem) }
            }
		}
		else if (elem.type == "unit") {
            
			unitData.push(elem)
            
			if (elem.vulnerable === true) { killable.push(elem) }
			if (elem.place == "home") { homeUnits.push(elem) }
			else if (elem.place == "party") { armyUnits.push(elem) } 
		}
		else if (elem.type == "achievement") {
        
			achData.push(elem) 
		}
	})
}

setup.civSizes = function() {
    
	indexArrayByAttr(civSizes, "id")

	civSizes.forEach(function(elem, i, arr) {
        
		elem.max_pop = (i + 1 < arr.length) ? (arr[i + 1].min_pop - 1) : Infinity
		elem.idx = i
	})

	civSizes.getCivSize = function(popcnt) {

		for (let i = 0; i < this.length; ++i) {
			if (popcnt <= this[i].max_pop) { return this[i] }
		}
        
		return this[0]
	}
}

setup.game = function() {

	addUITable(basicResources, "basicResources")
	addUITable(homeBuildings, "buildings")
	addUITable(homeUnits, "jobs")
	addUITable(armyUnits, "party")
	addUpgradeRows()
	addUITable(normalUpgrades, "upgrades")
	addAchievementRows()
	addRaidRows()
	addWonderSelectText()
	makeDeitiesTables()

	if (!load("localStorage")) {
        
		renameCiv()
		renameRuler()
	}

	setAutosave()

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))
}

setup.loop = function() {

	gameLoop()
	window.setInterval(gameLoop, 1000)
}

setup.all()

function load(loadType) {

	let loadVar = {}
	let settingsVar = {}

	if (loadType === "localStorage") {

        let string1 = localStorage.getItem(saveTag)
        let settingsString = localStorage.getItem(saveSettingsTag)

        if (!string1) {
            
            console.log("Unable to find variables in localStorage.")
            return
        }

		loadVar = JSON.parse(string1)
        settingsVar = JSON.parse(settingsString)

		if (!loadVar) {
            
			console.log("Unable to parse variables in localStorage.")
			return
		}

		gameLog("Loaded saved game from local storage")
	}
	
	if (loadType === "import") { loadVar = importByInput(ui.find("#impexpField")) }
    
    if (!loadVar.curCiv.zombieParty) { loadVar.curCiv.zombieParty = { owned:0 } }
    
    curCiv = loadVar.curCiv
    
	if (!civSizes[curCiv.raid.last]) {
		curCiv.raid.last = civSizes[curCiv.raid.targetMax].idx
	}
    

	if (isValid(settingsVar)){ settings = mergeObj(settings,settingsVar) }
 
	adjustMorale(0)
    
	updateRequirements(civData.mill)
	updateRequirements(civData.fortification)
	updateRequirements(civData.battleAltar)
	updateRequirements(civData.fieldsAltar)
	updateRequirements(civData.underworldAltar)
	updateRequirements(civData.catAltar)
	updateResourceTotals()
	makeDeitiesTables()
	updateDeity()
	updateUpgrades()
	updateTargets()
	updateDevotion()
	updateMorale()
	updateWonder()
	computeWonderCount()
    
	ui.find("#clicks").innerHTML = prettify(Math.round(curCiv.resourceClicks))
	ui.find("#civName").innerHTML = curCiv.civName
	ui.find("#rulerName").innerHTML = curCiv.rulerName

	return true
}

function save(savetype) {

	let saveVar = { curCiv:curCiv }
	let settingsVar = settings

	if (savetype == "export") {
        
		let savestring = "[" + JSON.stringify(saveVar) + "]"
		let compressed = LZString.compressToBase64(savestring)
		ui.find("#impexpField").value = compressed
        
		gameLog("Exported game to text")
		return true
	}

    localStorage.setItem(saveTag, JSON.stringify(saveVar))
    localStorage.setItem(saveSettingsTag, JSON.stringify(settingsVar))

    if (savetype == "auto") { gameLog("Autosaved") }
    else if (savetype == "manual") { gameLog("Saved game") }

	return true
}

//========== MAIN LOOP

function gameLoop() {
	
	if (settings.autosave && (++settings.autosaveCounter >= settings.autosaveTime)) { 
    
		settings.autosaveCounter = 0
		if (!save("auto")) { settings.autosave = false }
	}

	calculatePopulation()
    
    resourceData.forEach(resource => { if (isValid(resource.net)) { resource.net = 0 } })

	doFarmers()
	doWoodcutters()
	doMiners()
	doBlacksmiths()
	doTanners()
	doClerics()
	
	doStarve()

	resourceData.forEach(resource => { if (resource.owned > resource.limit) { resource.owned = resource.limit } })

	doMobs()
    
	if (civData.pestControl.timer > 0) { --civData.pestControl.timer }
    
	if (civData.glory.timer > 0) { ui.find("#gloryTimer").innerHTML = civData.glory.timer-- }
    else { ui.find("#gloryGroup").style.display = "none" }
    
	doShades()
	doEsiege(civData.esiege, civData.fortification)
	doRaid("party", "player", "enemy")

	doGraveyards()
	doHealers()
	doPlague() 
	doCorpse()
	doThrone()
    
	if (civData.grace.cost > 1000) {
        
		civData.grace.cost = Math.floor(--civData.grace.cost)
		ui.find("#graceCost").innerHTML = '<div class="col-auto"><img src="img/piety.png" class="icon-sm" alt="Piety" data-bs-toggle="tooltip" data-bs-title="Piety"> ' + prettify(civData.grace.cost) + '</div>'
	}
    
	tickWalk()
	doLabourers()
	tickTraders()
	
	achData.forEach(achObj => { 
    
		if (civData[achObj.id].owned) { return }
		if (isValid(achObj.test) && !achObj.test()) { return }
		civData[achObj.id].owned = true
		gameLog("<span class='text-success'>Achievement Unlocked: " + achObj.getQtyName() + "</span>")
	})

	achData.forEach(achObj => { ui.show("#" + achObj.id, achObj.owned) })
	
	updateResourceTotals()
	updateAll()
}

function calculatePopulation() {

	population = { current:	0, living: 0, limit: 0, healthy: 0, totalSick: 0 }

	population.limit = (
		civData.tent.owned 
		+ (civData.hut.owned * 3) 
		+ (civData.cottage.owned * 6) 
		+ (civData.house.owned * (10 + (civData.tenements.owned * 2) + (civData.slums.owned * 2))) 
		+ (civData.mansion.owned * 50)
	)

	unitData.forEach(unit => { 
		if (unit.isPopulation) {
            
			population.current += unit.owned
			
			if (unit.ill > 0) { population.totalSick += unit.ill }
		}
	})

	population.living = Math.max(0, population.current - curCiv.zombie.owned)

    population.healthy = population.current - population.totalSick
	population.healthy = Math.max(0, population.healthy - curCiv.zombie.owned)

	if (population.current < 0) {
		if (curCiv.zombie.owned > 0) {

			curCiv.zombie.owned += population.current
			population.current = 0
            
		} else {
            
			console.warn("Warning: Negative current population detected")
		}
	}	
}

function doFarmers() {
    
	let millMod = 1
	if (population.current > 0) { millMod = population.living / population.current }
    
	civData.food.net = (
		civData.farmer.owned 
		* (1 + (civData.farmer.efficiency * curCiv.morale.efficiency)) 
		* ((civData.pestControl.timer > 0) ? 1.01 : 1) 
		* getWonderBonus(civData.food) 
		* (1 + civData.walk.rate/120) 
		* (1 + civData.mill.owned * millMod / 200)
	)
    
	civData.food.net -= population.living
	civData.food.owned += civData.food.net
    
	if (civData.skinning.owned && civData.farmer.owned > 0) {
        
		let skinsChance = (civData.food.specialChance + (0.1 * civData.flensing.owned)) * (civData.food.increment + (civData.butchering.owned * civData.farmer.owned / 15.0)) * getWonderBonus(civData.skins)
		let skinsEarned = rndRound(skinsChance)        
		civData.skins.net += skinsEarned
		civData.skins.owned += skinsEarned
	}
}

function doWoodcutters() {
    
	civData.wood.net = civData.woodcutter.owned * (civData.woodcutter.efficiency * curCiv.morale.efficiency) * getWonderBonus(civData.wood)
	civData.wood.owned += civData.wood.net
    
	if (civData.harvesting.owned && civData.woodcutter.owned > 0) {
        
		let herbsChance = civData.wood.specialChance * (civData.wood.increment + ((civData.gardening.owned) * civData.woodcutter.owned / 5.0)) * getWonderBonus(civData.herbs)
		let herbsEarned = rndRound(herbsChance)
		civData.herbs.net += herbsEarned
		civData.herbs.owned += herbsEarned
	}
}

function doMiners() {
    
	civData.stone.net = civData.miner.owned * (civData.miner.efficiency * curCiv.morale.efficiency) * getWonderBonus(civData.stone)
	civData.stone.owned += civData.stone.net
    
	if (civData.prospecting.owned && civData.miner.owned > 0) {
        
		let oreChance = (civData.stone.specialChance + (civData.macerating.owned ? 0.1 : 0)) * (civData.stone.increment + ((civData.extraction.owned) * civData.miner.owned / 5.0)) * getWonderBonus(civData.ore)
		let oreEarned = rndRound(oreChance)
		civData.ore.net += oreEarned
		civData.ore.owned += oreEarned
	}
}

function doBlacksmiths() {
    
	let oreUsed = Math.min(civData.ore.owned, (civData.blacksmith.owned * civData.blacksmith.efficiency * curCiv.morale.efficiency))
	civData.ore.net -= oreUsed
	civData.ore.owned -= oreUsed
    
	let metalEarned = oreUsed * getWonderBonus(civData.metal)
	civData.metal.net += metalEarned
	civData.metal.owned += metalEarned
}

function doTanners() {
    
	let skinsUsed = Math.min(civData.skins.owned, (civData.tanner.owned * civData.tanner.efficiency * curCiv.morale.efficiency))
	civData.skins.net -= skinsUsed
	civData.skins.owned -= skinsUsed
    
	let leatherEarned = skinsUsed * getWonderBonus(civData.leather)
	civData.leather.net += leatherEarned
	civData.leather.owned += leatherEarned
}

function doClerics() {
    
	let pietyEarned = (
		civData.cleric.owned 
		* (civData.cleric.efficiency + (civData.cleric.efficiency * (civData.writing.owned))) 
		* (1 + (civData.secrets.owned * (1 - 100 / (civData.graveyard.owned + 100))))
		* curCiv.morale.efficiency
		* getWonderBonus(civData.piety)
	)
    
	civData.piety.net += pietyEarned
	civData.piety.owned += pietyEarned
}

function doStarve() {
    
	if (civData.food.owned < 0 && civData.waste.owned) {
        
		let corpseEaten = Math.min(civData.corpse.owned, -civData.food.owned)
		civData.corpse.owned -= corpseEaten
		civData.food.owned += corpseEaten
	}

	if (civData.food.owned < 0) {
        
		let numberStarve = starve(Math.ceil(population.living / 1000))
		if (numberStarve == 1) { gameLog("<span class='text-danger'>A Worker starved to death<span>") }
        else if (numberStarve > 1) { gameLog("<span class='text-danger'>" + prettify(numberStarve) + " Workers starved to death<span>") }
        
		adjustMorale(-0.01)
		civData.food.owned = 0
	}
}

function doMobs() {

	if (population.current > 0) { ++curCiv.attackCounter }
    
	if (population.current > 0 && curCiv.attackCounter > (60 * 5)) {
		if (600 * Math.random() < 1) {
            
			curCiv.attackCounter = 0
            
			let mobType = "wolf"
			if (population.current >= 10000) {
                
				let choose = Math.random()
				if (choose > 0.5) { mobType = "barbarian" } 
				else if (choose > 0.2) { mobType = "bandit" }
			}
            else if (population.current >= 1000) {
                
				if (Math.random() > 0.5) { mobType = "bandit" }
			}
            
			spawnMob(civData[mobType])
		}
	}

	getCombatants("home", "enemy").forEach(attacker => {
    
		if (attacker.owned <= 0) { return }

		let defenders = getCombatants(attacker.place, "player")
		if (!defenders.length) {
            
            attacker.onWin()
            return
        }

		defenders.forEach(defender => { makeFight(attacker, defender) })
	})
}

function doShades() {
    
	let defender = civData.shade
	if (defender.owned <= 0) { return }

	getCombatants(defender.place, "enemy").forEach(attacker => { 
    
		let num = Math.floor(Math.min((attacker.owned / 4), defender.owned))
		defender.owned -= num
		attacker.owned -= num
	})

	defender.owned = Math.max(Math.floor(defender.owned * 0.95), 0)
}

function doEsiege(siegeObj, targetObj) {
    
	if (siegeObj.owned <= 0) { return }

	if (!getCombatants(siegeObj.place, siegeObj.alignment).length && getCombatants(targetObj.place, targetObj.alignment).length) {

		if (targetObj.alignment == "player" && civData.mathematics.owned) {
            
			gameLog("<span class='text-success'>Captured " + prettify(siegeObj.owned) + " enemy siege engines</span>")
			civData.siege.owned += siegeObj.owned
		}
        
		siegeObj.owned = 0
	}
	else if (makeSiege(siegeObj, targetObj) > 0) {
		if (targetObj.id === "fortification") {
            
			updateRequirements(targetObj)
			gameLog("<span class='text-warning'>Enemy siege engine damaged our fortifications</span>")
		}
	}
}

function doRaid(place, attackerID, defenderID) {
    
	if (!curCiv.raid.raiding) { return }

	let attackers = getCombatants(place, attackerID)
	let defenders = getCombatants(place, defenderID)

	if (attackers.length && !defenders.length) {
        
		unitData.filter(elem => { return ((elem.alignment == defenderID) && (elem.place == place)) }).forEach(elem => { elem.owned = 0 })

		if (!curCiv.raid.victory) { gameLog("<span class='text-success'>Raid victorious</span>") }
		curCiv.raid.victory = true
	}

	if (!attackers.length && defenders.length) {
        
		unitData.filter(elem => { return ((elem.alignment == attackerID) && (elem.place == place)) }).forEach(elem => { elem.owned = 0 })

		gameLog("<span class='text-danger'>Raid defeated</span>")
		resetRaiding()
		return
	}

	attackers.forEach(attacker => { defenders.forEach(defender => { makeFight(attacker,defender) }) })

	makeSiege(civData.siege, civData.efort)
}

function doGraveyards() {
    
	if (civData.corpse.owned > 0 && curCiv.grave.owned > 0) {

		for (let i = 0; i < civData.cleric.owned; i++) {
			if (civData.corpse.owned > 0 && curCiv.grave.owned > 0) {
                
				civData.corpse.owned -= 1
				curCiv.grave.owned -= 1
			}
		}
	}
}

function doHealers() {
    
	let cureCount = (civData.healer.owned + (civData.cat.owned * civData.companion.owned)) * civData.healer.efficiency * curCiv.morale.efficiency    
	cureCount = Math.min(cureCount, population.totalSick)
    
	while (cureCount >= 1 && civData.herbs.owned >= 1) {
        
		let job = getNextPatient()
		if (!job) { break }
		healByJob(job)
		--cureCount
		--civData.herbs.owned
	}
}

function doPlague() {
    
	let jobInfected = getRandomPatient()
	let unitInfected = civData[jobInfected]
	let deathRoll = (100 * Math.random()) + 1

	if (unitInfected.ill <= 0 || unitInfected.owned <= 0) { return false }

	if (deathRoll <= 5) {

		killUnit(unitInfected)
		gameLog("<span class='text-danger'>A sick " + unitInfected.getQtyName(1) + " dies</span>")
		calculatePopulation()
		return true
	}
    else if (deathRoll > 99.9) {
        
		spreadPlague(1)
		gameLog("<span class='text-warning'>The sickness spreads to a new worker</span>")
		return true
    }
    
	return false
}

function doCorpse() {
    
	if (civData.corpse.owned <= 0) { return }
    
	let sickChance = 50 * Math.random() * (1 + civData.feast.owned)
	if (sickChance >= 1) { return }

	let infected = Math.floor(population.living / 100 * Math.random())
	if (infected <= 0) {  return }
	infected = spreadPlague(infected)
	if (infected > 0) {
        
		calculatePopulation()
		gameLog("<span class='text-warning'>" + prettify(infected) + " Workers got sick</span>")
	}

	if (Math.random() < 0.5) { civData.corpse.owned -= 1 }
}

function doThrone() {
    
	if (civData.throne.count >= 100){

		civData.temple.owned += Math.floor(civData.throne.count / 100)
		civData.throne.count = 0
        
		updateResourceTotals()
	}
}

function tickWalk() {

	if (civData.walk.rate > population.healthy) {
        
		civData.walk.rate = population.healthy
		ui.find("#ceaseWalk").disabled = true
	}
    
	if (civData.walk.rate <= 0) { return }

	for (let i = 0; i < civData.walk.rate; ++i) {
        
		let target = getRandomHealthyWorker()
		if (!target){ break }
		--civData[target].owned
	}
    
    calculatePopulation()
}

function doLabourers() {
    
	if (curCiv.curWonder.stage !== 1) { return }

	if (curCiv.curWonder.progress >= 100) {

		civData.unemployed.owned += civData.labourer.owned
		civData.unemployed.ill += civData.labourer.ill
		civData.labourer.owned = 0
		civData.labourer.ill = 0
        
		calculatePopulation()
		
		++curCiv.curWonder.stage
	}
    else {
		
		let prod = getWonderProduction()

		wonderResources.forEach(resource => { 
			resource.owned -= prod
			resource.net -= prod
		})

		curCiv.curWonder.progress += prod / (1000000 * getWonderCostMultiplier())
	}
}

function tickTraders() {
    
	if (population.current > 0) { ++curCiv.trader.counter }
    
	let delayMult = 60 * (3 - (civData.currency.owned + civData.commerce.owned))
	if (population.current > 0 && curCiv.trader.counter > delayMult) {
        
		let check = Math.random() * delayMult
		if (check < (1 + (0.2 * civData.comfort.owned))) {
            
			curCiv.trader.counter = 0            
            curCiv.trader.timer = 12 + (5 * (civData.currency.owned + civData.commerce.owned + civData.stay.owned))

            let tradeItems = [
                { materialId:"food",    requested:5000 },
                { materialId:"wood",    requested:5000 },
                { materialId:"stone",   requested:5000 },
                { materialId:"skins",   requested: 500 },
                { materialId:"herbs",   requested: 500 },
                { materialId:"ore",     requested: 500 },
                { materialId:"leather", requested: 250 },
                { materialId:"metal",   requested: 250 },
            ]

            let selected = tradeItems[Math.floor(Math.random() * tradeItems.length)]
            curCiv.trader.materialId = selected.materialId
            curCiv.trader.requested = selected.requested * (Math.ceil(Math.random() * 20))
		}
	}
	
	if (curCiv.trader.timer > 0) { curCiv.trader.timer-- }
}

//========== FUNCTIONAL

function starve(num) {
    
	if (num === undefined) { num = 1 }
	num = Math.min(num, population.living)
    
    let starveCount = 0
	for (let i = 0; i < num; ++i) { starveCount += killUnit(pickStarveTarget()) }
    
	return starveCount
}

function pickStarveTarget() {
    
	let modList = ["ill", "owned"]
	let jobList = ["unemployed", "blacksmith", "tanner", "miner", "woodcutter", "cleric", "cavalry", "soldier", "healer", "labourer", "farmer"]
	for (let modNum = 0; modNum < modList.length; ++modNum) {
		for (let jobNum = 0; jobNum < jobList.length; ++jobNum) {
			if (civData[jobList[jobNum]][modList[modNum]] > 0) { return civData[jobList[jobNum]] }
		}
	}

	if (civData.cavalryParty.owned > 0) { return civData.cavalryParty }
	if (civData.soldierParty.owned > 0) { return civData.soldierParty }

	return null
}

function spawnMob(mobObj, num){
    
	if (num === undefined) {
        
		let max_mob = (population.current / 50)
		num = Math.ceil(max_mob * Math.random())
	}

	if (num === 0) { return num }
    
    let num_sge = 0
	if (mobObj.species == "human") { num_sge = Math.floor(Math.random() * num / 100) }

	mobObj.owned += num
	civData.esiege.owned += num_sge

	let msg = prettify(num) + " " + mobObj.getQtyName(num) + " attacked"
	if (num_sge > 0) { msg += ", with " + prettify(num_sge) + " " + civData.esiege.getQtyName(num_sge) }
	gameLog("<span class='text-warning'>" + msg + "</span>")
}

function makeFight(attacker, defender) {
    
	if ((attacker.owned <= 0) || (defender.owned <= 0 )) { return }

	let fortMod = (defender.alignment == "player" ? (civData.fortification.owned * civData.fortification.efficiency) : (civData.efort.owned * civData.efort.efficiency))
	let palisadeMod = ((defender.alignment == "player") && civData.palisade.owned) * civData.palisade.efficiency

	let attackerCas = Math.min(attacker.owned, rndRound(getCasualtyMod(defender, attacker) * defender.owned * defender.efficiency))
	let defenderCas = Math.min(defender.owned, rndRound(getCasualtyMod(attacker, defender) * attacker.owned * (attacker.efficiency - palisadeMod) * Math.max(1 - fortMod, 0)))

	attacker.owned -= attackerCas
	defender.owned -= defenderCas

	let playerCredit = ((attacker.alignment == "player") ? defenderCas : (defender.alignment == "player") ? attackerCas : 0)

	curCiv.enemySlain.owned += playerCredit
	if (civData.throne.owned) { civData.throne.count += playerCredit }
	civData.corpse.owned += attackerCas + defenderCas
	if (civData.book.owned) { civData.piety.owned += (attackerCas + defenderCas) * 10 }

	calculatePopulation()
}

function makeSiege(siegeObj, targetObj) {
    
	let firing = Math.ceil(Math.min(siegeObj.owned / 2, targetObj.owned * 2))
	for (let i = 0; i < firing; ++i) {
        
		let hit = Math.random()
		if (hit > 0.95) { --siegeObj.owned }
		if (hit >= siegeObj.efficiency) { continue }
		if (--targetObj.owned <= 0) { break }
	}
}

function healByJob(job, num) {
    
	if (!isValid(job) || !job) { return 0 }
    
	if (num === undefined) { num = 1 }
	num = Math.min(num, civData[job].ill)
	num = Math.max(num, -civData[job].owned)
	civData[job].ill -= num
	civData[job].owned += num

	calculatePopulation()

	return num
}

function killUnit(unit) {
    
	if (!unit) { return 0 }

	if (unit.ill) { unit.ill -= 1 }
	else { unit.owned -= 1 }
	
	civData.corpse.owned += 1

	if (civData.book.owned) { civData.piety.owned += 10 }
	calculatePopulation()
    
	return 1
}

function spreadPlague(sickNum){
    
	calculatePopulation()

	let actualNum = 0
	for (let i = 0; i < sickNum; i++) { actualNum += -healByJob(getRandomHealthyWorker(), -1) }

	return actualNum
}

function setAutosave(value) {
    
	if (value !== undefined) { settings.autosave = value } 
	ui.find("#toggleAutosave").checked = settings.autosave
}

function makeHavoc(attacker) {
    
	let havoc = Math.random()
	if (havoc < 0.3) { makeSlaughter(attacker) } 
	else if (havoc < 0.6) { makeLoot(attacker) } 
	else { makeSack(attacker) }
}

function makeSlaughter(attacker) {
    
	let target = getRandomHealthyWorker()
	if (target) {
        
        let targetUnit = civData[target]
		if (targetUnit.owned >= 1) {

			targetUnit.owned -= 1
			if (attacker.species != "animal") { civData.corpse.owned += 1 }
            
			if (Math.random() < attacker.killExhaustion) { --attacker.owned }
            
            let killVerb = (attacker.species == "animal") ? "eaten" : "killed"
			gameLog("<span class='text-danger'>" + targetUnit.getQtyName(1) + " " + killVerb + " by " + attacker.getQtyName(attacker.owned) + "</span>")
		}
	}
    else {
        
		let leaving = Math.ceil(attacker.owned * Math.random() * attacker.killFatigue)
		attacker.owned -= leaving
	}
    
	calculatePopulation()
}

function makeLoot(attacker) {
    
	let target = lootable[Math.floor(Math.random() * lootable.length)]
    
	let stolenQty = Math.floor(Math.random() * 1000)
	stolenQty = Math.min(stolenQty, target.owned)
    
	if (stolenQty > 0) { gameLog("<span class='text-danger'>" + stolenQty + " " + target.getQtyName(stolenQty) + " stolen by " + attacker.getQtyName(attacker.owned) + "</span>") }
    
	target.owned -= stolenQty
	if (target.owned <= 0) {

		let leaving = Math.ceil(attacker.owned * Math.random() * attacker.lootFatigue)
		attacker.owned -= leaving
	}

	if (--attacker.owned < 0) { attacker.owned = 0 }
}

function makeSack(attacker) {
    
	let target = sackable[Math.floor(Math.random() * sackable.length)]

	let destroyVerb = "burned"
	if (target == civData.fortification) { destroyVerb = "damaged" } 

	if (target.owned > 0) {
        
		--target.owned
		++civData.freeLand.owned
		gameLog("<span class='text-danger'>" + target.getQtyName(1) + " " + destroyVerb + " by " + attacker.getQtyName(attacker.owned) + "</span>")
	}
    else {

		let leaving = Math.ceil(attacker.owned * Math.random() * (1 / 112))
		attacker.owned -= leaving
	}

	if (--attacker.owned < 0) { attacker.owned = 0 }
    
	updateRequirements(target)
	calculatePopulation()
}

function resetRaiding() {
    
	curCiv.raid.raiding = false
	curCiv.raid.victory = false
	curCiv.raid.epop = 0
	curCiv.raid.plunderLoot = {}
	curCiv.raid.last = ""

	unitData.filter(elem => { return elem.alignment == "enemy" && elem.place == "party" })
			.forEach(elem => { elem.reset() })
}

function adjustMorale(delta) {

	if (delta > 1000) { return }
    
	if (population.current > 0) {

		let fraction = population.living / population.current
		let max = 1 + (0.5 * fraction)
		let min = 1 - (0.5 * fraction)

		curCiv.morale.efficiency += delta * fraction

		if (curCiv.morale.efficiency > max) { curCiv.morale.efficiency = max }
        else if (curCiv.morale.efficiency < min) { curCiv.morale.efficiency = min }
        
		updateMorale()
	}
}

function digGraves(num) {

	curCiv.grave.owned += 100 * num
    
	updatePopulation()
}

function smiteMob(mobObj) {
    
	if (!isValid(mobObj.owned) || mobObj.owned <= 0) { return }
    
	let num = Math.min(mobObj.owned ,Math.floor(civData.piety.owned / 100))
	civData.piety.owned -= num * 100
	mobObj.owned -= num
	civData.corpse.owned += num
	curCiv.enemySlain.owned += num
	if (civData.throne.owned) { civData.throne.count += num }
	if (civData.book.owned) { civData.piety.owned += num * 10 }
    
	gameLog("Struck down " + num + " " + mobObj.getQtyName(num))
}

function payFor(costObj, qty) {
    
	if (qty === undefined) { qty = 1 }
	if (qty === false) { qty = -1 }
    
	costObj = valOf(costObj, qty)
	if (!isValid(costObj)) { return 0 }

	qty = Math.min(qty, canAfford(costObj))
	if (qty === 0) { return 0 }

	for (let i in costObj) {

		let num = (typeof costObj[i] == "function") ? costObj[i](qty) : (costObj[i] * qty)
		if (!num) { continue }
        
		civData[i].owned -= num
	}

	return qty
}

//========== UTILS

function prettify(input) { return Number(input).toLocaleString() }

function getWonderBonus(resourceObj) {
    
	if (!resourceObj) { return 1 }
	return (1 + (wonderCount[resourceObj.id] || 0) / 10)
}

function getCombatants(place, alignment) {
    
	return unitData.filter(elem => { 
		return ((elem.alignment == alignment) && (elem.place == place) && (elem.combatType) && (elem.owned > 0))
	})
}

function getCasualtyMod(attacker, defender) {
    
	if (defender.combatType == "cavalry" && attacker.combatType == "infantry") { return 1.50 }
	return 1.0
}

function getNextPatient() { 

	for (let i = 0; i < PATIENT_LIST.length; ++i) {
		if (civData[PATIENT_LIST[i]].ill > 0) { return PATIENT_LIST[i] }
	}
    
	return ""
}

function getRandomPatient(n) {
    
	n = n || 1
    
	let i = Math.floor(Math.random() * PATIENT_LIST.length)
	if (civData[PATIENT_LIST[i]].ill > 0 || n > 10) { return PATIENT_LIST[i] }
    
	return getRandomPatient(++n)
}

function getRandomHealthyWorker() {
    
	let num = Math.random() * population.healthy
    
    let chance = 0
	for (let i = 0; i < killable.length; ++i) {
        
		chance += civData[killable[i].id].owned
		if (chance > num) { return killable[i].id }
	}

	return ""
}

function getWonderProduction() {
    
	let prod = civData.labourer.owned
	wonderResources.forEach(resource => { prod = Math.min(prod, resource.owned) })
    
	return prod
}

function getWonderCostMultiplier() {
    
	let mostWonders = 0
	for (let i in wonderCount) { if (wonderCount.hasOwnProperty(i)) { mostWonders = Math.max(mostWonders, wonderCount[i]) }}
    
	return Math.pow(1.5, mostWonders)
}

function getCurDeityDomain() {
    
	return (curCiv.deities.length > 0) ? curCiv.deities[0].domain : undefined
}

function haveDeity(name) {
    
	for (let i = 0; i < curCiv.deities.length; ++i) { 
		if (curCiv.deities[i].name == name) { return i } 
	}

	return false
}

function calcWorkerCost(num, curPop) {

	if (curPop === undefined) { curPop = population.living }
	return (20 * num) + calcArithSum(0.001, curPop, curPop + num)
}

function calcZombieCost(num) { return calcWorkerCost(num, curCiv.zombie.owned) / 5 }

function typeToId(deityType) {
    
	if (deityType == "Battle") { return "battle" }
	if (deityType == "Cats") { return "cats" }
	if (deityType == "the Fields") { return "fields" }
	if (deityType == "the Underworld") { return "underworld" }
    
	return deityType
}

function idToType(domainId) {
    
	if (domainId == "battle") { return "Battle" }
	if (domainId == "cats") { return "Cats" }
	if (domainId == "fields") { return "the Fields" }
	if (domainId == "underworld") { return "the Underworld" }
    
	return domainId
}

function getLandTotals() {

	let ret = { lands:0, buildings:0, free:0 }
    
	buildingData.forEach(elem => {
        
		if (elem.subType == "land") { ret.free += elem.owned }
		else { ret.buildings += elem.owned }
	})
    
	ret.lands = ret.free + ret.buildings
    
	return ret
}

function meetsPrereqs(prereqObj) {
    
	if (!isValid(prereqObj)) { return false }

	for (let i in prereqObj) {
        
		if (i === "deity") {
			if (getCurDeityDomain() != prereqObj[i]) { return false }
		} else if (i === "wonderStage") {
			if (curCiv.curWonder.stage !== prereqObj[i]) { return false }
		} else if (isValid(curCiv[i]) && isValid(curCiv[i].owned)) {
			if (curCiv[i].owned < prereqObj[i]) { return false }
		}
	}
 
	return true
}

function canAfford(costObj, qty) {
    
	if (!isValid(costObj)) { return 0 }
    
	if (qty === undefined) { qty = Infinity }
	if (qty === false) { qty = -1 }
    
	for (let i in costObj) {
        
		if (costObj[i] === 0) { continue }

		if (typeof costObj[i] == "function") { qty = Math.max(0, Math.min(1, qty)) }
		qty = Math.min(qty, Math.floor(civData[i].owned / valOf(costObj[i])))
		if (qty === 0) { return qty }
	}

	return qty
}

function canPurchase (purchaseObj, qty) {
    
	if (!purchaseObj) { return 0 }
	if (qty === undefined) { qty = Infinity }
	if (qty === false) { qty = -1 }

	if (!meetsPrereqs(purchaseObj.prereqs)) { qty = Math.min(qty, 0) }
	qty = Math.max(qty, -(purchaseObj.salable ? purchaseObj.owned : 0))
	if (purchaseObj.source) { qty = Math.min(qty, curCiv[purchaseObj.source].owned) }
	if (purchaseObj.isDest && !purchaseObj.isDest()) { qty = Math.min(qty, purchaseObj.limit - purchaseObj.total) }

	return Math.min(qty, canAfford(purchaseObj.require))
}

function playerCombatMods() {
    
	return (0.01 * (civData.riddle.owned + civData.weaponry.owned + civData.shields.owned))
}

function getCivType() {
    
	let civType = civSizes.getCivSize(population.living).name
	if (population.living === 0 && population.limit >= 1000) { civType = "Ghost Town" }
	if (curCiv.zombie.owned >= 1000 && curCiv.zombie.owned >= 2 * population.living) { civType = "Necropolis" }
    
	return civType
}

function computeWonderCount() {
    
	wonderCount = {}
	curCiv.wonders.forEach(elem => {
        
		let resourceId = elem.resourceId
		if (!isValid(wonderCount[resourceId])) { wonderCount[resourceId] = 0 }
		wonderCount[resourceId] += 1
	})
}

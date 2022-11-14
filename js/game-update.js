//---
function updateAll() {
    
	updateTrader()
	updateUpgrades()
    
	homeBuildings.forEach(elem => { updatePurchaseRow(elem) })
	homeUnits.forEach(elem => { updatePurchaseRow(elem) })
    armyUnits.forEach(elem => { updatePurchaseRow(elem) })
    
	updatePopulation()
	updateTargets()
	updateDevotion()
	updateWonder()
}

//---
function updateTrader() {
    
	let isTraderHere = curCiv.trader.timer > 0
	if (isTraderHere) {
        
		ui.find("#tradeType").innerHTML = civData[curCiv.trader.materialId].getQtyName(curCiv.trader.requested)
		ui.find("#traderTimer").innerHTML = curCiv.trader.timer + " second" + ((curCiv.trader.timer != 1) ? "s" : "")
		ui.find("#tradeRequested").innerHTML = prettify(curCiv.trader.requested)
    }
    
	ui.show("#noTrader", !isTraderHere)
	ui.show("#tradeContainer", isTraderHere)
	ui.show("#tradeSelect .notif", isTraderHere)
}

//---
function updateUpgrades() {
    
	let domain = getCurDeityDomain()
	let hasDomain = (domain === "") ? false : true
	let canSelectDomain = (civData.worship.owned && !hasDomain)
    
	upgradeData.forEach(elem => {
        
		updatePurchaseRow(elem)

		ui.show(("#P" + elem.id), elem.owned)
        
        if (elem.owned) {
            
            if (elem.subType == "pantheon") { ui.show(("#pantheonUpgrades"), true) }
            else { ui.show(("#purchasedUpgradesGroup"), true) }
        }
	})

	ui.show("#deityPane .notYet", (!hasDomain && !canSelectDomain))
	ui.find("#renameDeity").disabled = (!civData.worship.owned)
	ui.show("#battleUpgrades", (domain == "battle"))
	ui.show("#fieldsUpgrades", (domain == "fields"))
	ui.show("#underworldUpgrades", (domain == "underworld"))
	ui.show("#zombieWorkers", (curCiv.zombie.owned > 0))
	ui.show("#catsUpgrades", (domain == "cats"))

	ui.show("#deityDomains", canSelectDomain)
    
	ui.findAll("#deityDomains button.purchaseFor500Piety").forEach(btn => {
		btn.disabled = (!canSelectDomain || (civData.piety.owned < 500))
	})
    
	ui.show("#deitySelect .alert", canSelectDomain)

	ui.show("#" + domain + "Upgrades", hasDomain)

	ui.show("#conquest", civData.standard.owned)
	ui.show("#conquestPane .notYet", (!civData.standard.owned))

	ui.show("#tradeUpgradeContainer", civData.trade.owned)
	ui.show("#tradePane .notYet", !civData.trade.owned)
    
    ui.findAll("#tradePane .tradeResource").forEach(elem => {
        elem.disabled = civData.gold.owned < 1
    })
}

//---
function updatePurchaseRow(purchaseObj) {
    
	let elem = ui.find("#" + purchaseObj.id + "Row")
	if (!elem) {
        
        console.warn("Missing UI element for " + purchaseObj.id)
        return
    }
    
	if (purchaseObj.hasVariableCost()) { updateRequirements(purchaseObj) }

	let maxQty = canPurchase(purchaseObj)
    if (purchaseObj.type == "building") { maxQty = Math.max(0, Math.min(maxQty, civData.freeLand.owned)) }
    
	let minQty = canPurchase(purchaseObj, -Infinity)

	let buyElems = elem.querySelectorAll("[data-action='purchase']")
	buyElems.forEach(function(elt) {
        
		let purchaseQty = dataset(elt, "quantity")
		let absQty = abs(purchaseQty)
		if ((absQty == "custom") || (absQty == Infinity)) { purchaseQty = sgn(purchaseQty) }
		elt.disabled = ((purchaseQty > maxQty) || (purchaseQty < minQty))
	})

	let hideBoughtUpgrade = ((purchaseObj.type == "upgrade") && (purchaseObj.owned == purchaseObj.limit) && !purchaseObj.salable)
	let havePrereqs = (purchaseObj.owned != 0) || meetsPrereqs(purchaseObj.prereqs)
	ui.show(elem, havePrereqs && !hideBoughtUpgrade)
}

//---
function updateRequirements(buildingObj) {
    
	let displayNode = document.getElementById(buildingObj.id + "Cost")
	if (displayNode) { displayNode.innerHTML = getCostHtml(buildingObj.require) }
}

//---
function updatePopulation() {

	ui.findAll("[data-action='display_pop']").forEach(elem => {
        
		let prop = dataset(elem, "target")
		elem.innerHTML = prettify(Math.floor(population[prop]))
	})

	ui.show("#graveTotal", (curCiv.grave.owned > 0))
	ui.show("#totalSickRow",(population.totalSick > 0))

	ui.find("#civType").innerHTML = getCivType()

	if (population.current >= 10) { ui.findAll(".unit10").forEach(elem => { ui.show(elem, true) }) }
	if (population.current >= 100) { ui.findAll(".unit100").forEach(elem => { ui.show(elem, true) }) }
	if (population.current >= 1000) { ui.findAll(".unit1000").forEach(elem => { ui.show(elem, true) }) }
	if (population.current >= 1000) { ui.findAll(".unitInfinity").forEach(elem => { ui.show(elem, true) }) }

	if (population.current >= 100) { ui.findAll(".building10").forEach(elem => { ui.show(elem, true) }) }
	if (population.current >= 1000) { ui.findAll(".building100").forEach(elem => { ui.show(elem, true) }) }
	if (population.current >= 10000) { ui.findAll(".building1000").forEach(elem => { ui.show(elem, true) }) }

	let maxSpawn = Math.max(0, Math.min((population.limit - population.living), logSearchFn(calcWorkerCost, civData.food.owned)))

	ui.find("#spawn1button").disabled = (maxSpawn < 1)
	ui.find("#spawnMaxbutton").disabled = (maxSpawn < 1)
	ui.find("#spawn10button").disabled = (maxSpawn < 10)
	ui.find("#spawn100button").disabled = (maxSpawn < 100)
	ui.find("#spawn1000button").disabled = (maxSpawn < 1000)
    
	ui.find("#workerCost").innerHTML = prettify(Math.round(calcWorkerCost(1)))
	ui.find("#workerNumMax").innerHTML = prettify(Math.round(maxSpawn))

	let canRaise = (getCurDeityDomain() == "underworld" && civData.devotion.owned >= 20)
	let maxRaise = canRaise ? logSearchFn(calcZombieCost, civData.piety.owned) : 0
    
	ui.show("#raiseDeadRow", canRaise)
	ui.find("#raiseDead").disabled = (maxRaise < 1)
	ui.find("#raiseDeadMax").disabled = (maxRaise < 1)
	ui.find("#raiseDead100").disabled = (maxRaise < 100)

	achData.forEach(achObj => { ui.show("#" + achObj.id, achObj.owned) })
    
	updateMorale()
}

//---
function updateMorale() {

	if (population.living < 1) { 
    
		ui.find("#morale").className = "row gx-1"
		return
	}

	let happinessRank
	     if (curCiv.morale.efficiency > 1.4) { happinessRank = 1 }
	else if (curCiv.morale.efficiency > 1.2) { happinessRank = 2 }
	else if (curCiv.morale.efficiency > 0.8) { happinessRank = 3 }
	else if (curCiv.morale.efficiency > 0.6) { happinessRank = 4 }
	else                                     { happinessRank = 5 }
    
	ui.find("#morale").className = "row gx-1 happy-" + happinessRank
}

//---
function updateTargets() {
    
    ui.show("#raidGroup", !curCiv.raid.raiding)
	ui.show("#victoryGroup", curCiv.raid.victory)

	if (!curCiv.raid.raiding) {
        
        let haveArmy = false
		if (getCombatants("party", "player").length > 0) { haveArmy = true }
        
        ui.findAll(".raid").forEach(elem => { elem.disabled = (!civData.standard.owned || !haveArmy || (civSizes[dataset(elem, "target")].idx > civSizes[curCiv.raid.targetMax].idx)) })
	}
}

//---
function updateDevotion() {
    
	ui.find("#deityADevotion").innerHTML = civData.devotion.owned

	buildingData.forEach(elem => {
        if (elem.subType == "altar") {
            
            ui.show(("#" + elem.id + "Row"), meetsPrereqs(elem.prereqs))
            document.getElementById(elem.id).disabled = (!(meetsPrereqs(elem.prereqs) && canAfford(elem.require)))
        }
    })

	powerData.forEach(elem => {
        if (elem.subType == "prayer") {

            if (elem.id == "raiseDead") { return }
            ui.show(("#" + elem.id + "Row"), meetsPrereqs(elem.prereqs))
            document.getElementById(elem.id).disabled = !(meetsPrereqs(elem.prereqs) && canAfford(elem.require))
        }
    })

	if (population.healthy < 1) { 
    
		ui.find("#wickerman").disabled = true
		ui.find("#walk").disabled = true
	}

	ui.find("#ceaseWalk").disabled = (civData.walk.rate === 0)
    ui.find("#iconoclasm").disabled = civData.gold.owned < 1000 ? true : false
}

//---
function updateWonder() {
    	
	let isLimited = false
	if (curCiv.curWonder.stage === 1) {
        
        let prod = getWonderProduction()
        isLimited = prod < civData.labourer.owned
    }

	ui.show("#lowResources", isLimited)
	ui.show("#upgradesSelect .notif", isLimited)

    let lowItem = null
	for (let i = 0; i < wonderResources.length; ++i) { 
		if (wonderResources[i].owned < 1) {
            
			lowItem = wonderResources[i]
			break
		} 
	}
	if (lowItem) { ui.find("#limited").innerHTML = " by low <span class='text-capitalize'>" + lowItem.getQtyName() + "</span>" }

	if (curCiv.curWonder.progress >= 100) { ui.find("#lowResources").style.display = "none" }

	let haveTech = (civData.architecture.owned && civData.civilservice.owned)

	ui.show("#wondersContainer", (haveTech || curCiv.wonders.length > 0))
	ui.show("#startWonderLine", (haveTech && curCiv.curWonder.stage === 0 ))

	ui.find("#startWonder").disabled = (!haveTech || curCiv.curWonder.stage !== 0)

	ui.show("#labourerRow", (curCiv.curWonder.stage === 1))
	ui.show("#wonderInProgress", (curCiv.curWonder.stage === 1))
	ui.show("#speedWonderGroup", (curCiv.curWonder.stage === 1))
	ui.find("#speedWonder").disabled = (curCiv.curWonder.stage !== 1 || !canAfford({ gold:100 }))
	if (curCiv.curWonder.stage === 1) {
        
		ui.find("#progressBar").style.width = curCiv.curWonder.progress.toFixed(2) + "%"
		ui.find("#progressNumber").innerHTML = curCiv.curWonder.progress.toFixed(2)
	}

	ui.show("#wonderCompleted", (curCiv.curWonder.stage === 2))
 
	updateWonderList()
}

//---
function updateWonderList() {
    
	if (curCiv.wonders.length === 0) {
        
        ui.show("#pastWondersContainer", false)
        return
    }

    ui.show("#pastWondersContainer", true)
        
	let html = "<div class='row gx-3 gy-1'>"
	for (let i = (curCiv.wonders.length - 1); i >= 0; --i) {
		try {
            
            html += "<div class='col-auto'>"
                html += "<span class='text-success me-1'>+10%</span>"
                html += "<img src='img/" + curCiv.wonders[i].resourceId + ".png' class='icon-sm' alt='" + curCiv.wonders[i].resourceId + "' data-bs-toggle='tooltip' data-bs-title='" + curCiv.wonders[i].resourceId + "' />"
                html += "<span class='text-capitalize ms-1'>" + curCiv.wonders[i].resourceId + "</span>"
            html += "</div>"
            
		} catch(err) {
            
			console.log("Could not build wonder row " + i)
		}
	}
    html += "</div>"
    
	ui.find("#pastWonders").innerHTML = html
}

//---
function updateAfterReset() {
    
	updateRequirements(civData.mill)
	updateRequirements(civData.fortification)
	updateRequirements(civData.battleAltar)
	updateRequirements(civData.fieldsAltar)
	updateRequirements(civData.underworldAltar)
	updateRequirements(civData.catAltar)

	ui.find("#graceCost").innerHTML = '<div class="col-auto"><img src="img/piety.png" class="icon-sm" alt="Piety" data-bs-toggle="tooltip" data-bs-title="Piety"> ' + prettify(civData.grace.cost) + '</div>'

	updateResourceTotals()
	updateUpgrades()
	updateDeity()
	updateDevotion()
	updateTargets()
	updateWonder()
    updatePopulation()

	makeDeitiesTables()

	ui.find("#renameDeity").disabled = "true"
	ui.find("#raiseDead").disabled = "true"
	ui.find("#raiseDead100").disabled = "true"
	ui.find("#raiseDeadMax").disabled = "true"
	ui.find("#smite").disabled = "true"
	ui.find("#wickerman").disabled = "true"
	ui.find("#pestControl").disabled = "true"
	ui.find("#grace").disabled = "true"
	ui.find("#walk").disabled = "true"
	ui.find("#ceaseWalk").disabled = "true"
	ui.find("#lure").disabled = "true"
	ui.find("#companion").disabled = "true"
	ui.find("#comfort").disabled = "true"
	ui.find("#book").disabled = "true"
	ui.find("#feast").disabled = "true"
	ui.find("#blessing").disabled = "true"
	ui.find("#waste").disabled = "true"
	ui.find("#riddle").disabled = "true"
	ui.find("#throne").disabled = "true"
	ui.find("#glory").disabled = "true"
	ui.find("#summonShade").disabled = "true"

	ui.find("#conquest").style.display = "none"

	ui.find(".notif").style.display = "none"
	ui.find("#tradeContainer").style.display = "none"
	ui.find("#tradeUpgradeContainer").style.display = "none"
	ui.find("#iconoclasmList").innerHTML = ""
	ui.find("#iconoclasm").disabled = false
    
    ui.findAll(".unit10").forEach(elem => { ui.show(elem, false) })
    ui.findAll(".unit100").forEach(elem => { ui.show(elem, false) })
    ui.findAll(".unit1000").forEach(elem => { ui.show(elem, false) })
    ui.findAll(".unitInfinity").forEach(elem => { ui.show(elem, false) })
    
    ui.findAll(".building10").forEach(elem => { ui.show(elem, false) })
    ui.findAll(".building100").forEach(elem => { ui.show(elem, false) })
    ui.findAll(".building1000").forEach(elem => { ui.show(elem, false) })
    
    ui.show("#purchasedUpgradesGroup", false)
}

//---
function updateResourceTotals() {
    
    ui.findAll("[data-action='display']").forEach(elem => { elem.innerHTML = prettify(Math.floor(curCiv[dataset(elem, "target")].owned)) })

	ui.findAll("[data-action='displayNet']").forEach(elem => {
        
		let val = civData[dataset(elem,"target")].net
		if (!isValid(val)) { return }

		if (val < 0) { elem.style.color = "#f00" }
		else if (val > 0) { elem.style.color = "#0b0" }

		elem.innerHTML = ((val < 0) ? "" : "+") + prettify(val.toFixed(1)) + " /s"
	})

	ui.find("#maxfood").innerHTML = "/" + prettify(civData.food.limit)
	ui.find("#maxwood").innerHTML = "/" + prettify(civData.wood.limit)
	ui.find("#maxstone").innerHTML = "/" + prettify(civData.stone.limit)
    
    let landTotals = getLandTotals()
	ui.find("#totalBuildings").innerHTML = prettify(landTotals.buildings)
	ui.find("#totalLand").innerHTML = prettify(landTotals.lands)

	ui.find("#tradeButton").disabled = !curCiv.trader || !curCiv.trader.timer || (civData[curCiv.trader.materialId].owned < curCiv.trader.requested)

	ui.find("#renameRuler").disabled = (curCiv.rulerName == "Cheater")
}

//---
function updateDeity() {
    
	let hasDeity = (curCiv.deities[0].name) ? true : false

	ui.find("#deityAName").innerHTML = curCiv.deities[0].name
	ui.find("#deityADomain").innerHTML = getCurDeityDomain() ? idToType(getCurDeityDomain()) : ""
	ui.find("#deityADevotion").innerHTML = civData.devotion.owned

	ui.show("#deityContainer", hasDeity)
	ui.show("#activeDeity", hasDeity)
	ui.show("#oldDeities", (hasDeity || curCiv.deities.length > 1))
	ui.show("#pantheonContainer", (curCiv.deities.length > 1))
	ui.show("#iconoclasmGroup", (curCiv.deities.length > 1))
}

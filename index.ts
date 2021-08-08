//////// HELPING FUNCTIONS
function randomBusinessName(): string {
	var adjectives: Array<string> = ["Blue", "Red", "Green", "Purple", "Orange", "White", "Trusty", "Speedy", "Enigmatic", "Fly", "Golden", "Sturdy", "Graceful", "Rapid", "Robust", "American", "British", "Asian", "European", "Indian", "Italian", "Australian", "Chinese", "Russian", "Nordic", "Southern", "Northern", "Southwest", "Express", "Paper", "Malaysia", "Thai"]
	var nouns: Array<string> = ["Planes", "Airways", "Skies", "Air", "Airlines", "Flyers", "Jets", "Pilots", "Air Transport", "Helicopters", "Cargo"]
	var name: string = `${randomChoice(adjectives)} ${randomChoice(nouns)}`
	if (Math.random() < 0.3) {
		var name = randomChoice(adjectives) + ' ' + name
	}
	return name
}
function randomPlaneName(): string {
	var name = ["Boeing 737-800","Boeing 737-900","Boeing 737 Max 9","Boeing 747","Boeing 757","Boeing 767","Boeing 777","Boeing 777-200","Boeing 777X","Boeing 777-300","Boeing 787 Dreamliner","Airbus A320","Airbus A330","Airbus A350","Airbus A360"]
    
	return ` ${randomChoice(name)}`
}
function prettyCashString(cash: number): string {
	return "$" + cash.toLocaleString("en-gb", { maximumFractionDigits: 0, currency: "usd" })
}
function randomChoice(things: Array<any>): any {
	return things[Math.floor(Math.random() * things.length)];
}
function displayInfo(message: string): void {
	var div = <HTMLElement>document.getElementById("info")
	var span = document.createElement("span")
	span.classList.add("fade-in")
	span.innerHTML = message
	setTimeout(() => {
		span.classList.add("fade-out")
		setTimeout(() => {
			span.remove()
		}, 1000)
	}, 5000)
	div.appendChild(span)
}
function displayError(message: string): void {
	var div = <HTMLElement>document.getElementById("error")
	var span = document.createElement("span")
	span.classList.add("fade-in")
	span.innerHTML = message
	setTimeout(() => {
		span.classList.add("fade-out")
		setTimeout(() => {
			span.remove()
		}, 1000)
	}, 5000)
	div.appendChild(span)
}
function dataLabels(rows: Array<Array<string>>): HTMLDListElement {
	var elem = document.createElement("dl")
	rows.forEach(r => {
		var dt = document.createElement("dt")
		dt.innerHTML = r[0]
		var dd = document.createElement("dd")
		dd.innerHTML = r[1]
		elem.appendChild(dt)
		elem.appendChild(dd)
	})
	return elem
}
function listLabels(rows: Array<Array<String>>): HTMLElement {
	var elem = document.createElement("ul")
	rows.forEach(r => {
		var li = document.createElement("li")
		li.innerHTML = `<strong>${r[0]}:</strong>${r[1]}`
		elem.appendChild(li)
	})
	return elem
}
function createElement(elementType: string, elementId?: string, className?: string, innerText?: string) {
	var e = document.createElement(elementType)
	if (elementId) {
		e.setAttribute("id", elementId)
	}
	if (className) {
		e.setAttribute("class", className)
	}
	if (innerText) {
		e.innerText = innerText
	}
	return e
}
function createTitle(text: string, elementType: string = "h1"): HTMLElement {
	var h = document.createElement(elementType)
	h.innerHTML = text
	return h
}
function createParagraph(text: string): HTMLParagraphElement {
	var p = document.createElement("p")
	p.innerText = text
	return p
}
function hideElement(elem: HTMLElement): void {
	elem.style.display = 'none'
}
function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
	function deg2rad(deg: number): number {
		return deg * (Math.PI / 180)
	}
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2 - lat1);  // deg2rad below
	var dLon = deg2rad(lon2 - lon1);
	var a =
		Math.sin(dLat / 2) * Math.sin(dLat / 2) +
		Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
		Math.sin(dLon / 2) * Math.sin(dLon / 2)
		;
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
	var d = R * c; // Distance in km
	return d;
}
//////// OUR TYPES & CLASSES (THINGS)
type AirportCode = string

class Airport {
	code: AirportCode
	name: string
	country: string
	lat: number
	lon: number
	popularity: number
	constructor(code: AirportCode, name: string, country: string, lat: number, lon: number, popularity: number = 0) {
		this.code = code
		this.name = name
		this.country = country
		this.lat = lat
		this.lon = lon
		this.popularity = popularity
	}
	cardHtml(): HTMLElement {
		return dataLabels([
			["IATA code", this.code],
			["Country", this.country],
			["Popularity", String(this.popularity)],
		])
	}
}

class Route {
	identifier: string
	fromAirport: Airport
	toAirport: Airport
	popularity: number
	purchaseCost: number
	lastRunAt?: Date
	lastResultedAt?: Date
	nextAvailableAt?: Date
	plane?: Plane
	constructor(fromAirport: Airport, toAirport: Airport) {
		this.identifier = [fromAirport.code, toAirport.code].sort().join("-")
		this.fromAirport = fromAirport
		this.toAirport = toAirport
		this.popularity = 10 + Math.floor(Math.random() * 90)
		this.purchaseCost = 100 * this.popularity + Math.ceil(Math.random() * 1000)
	}
	distance(): number {
		return getDistanceFromLatLonInKm(this.fromAirport.lat, this.fromAirport.lon, this.toAirport.lat, this.toAirport.lon)
	}
	flightDuration(): number {
		return this.distance() / 20
	}
	timeRemaining(): number {
		var now = new Date()
		if (this.lastRunAt) {
			var secondsSinceLastRun = (+now - +this.lastRunAt) / 1000
			var runTimeSeconds = this.flightDuration()
			return Math.max(0, Math.floor((runTimeSeconds - secondsSinceLastRun)))
		}
		return 0
	}
	canRun(): boolean {
		var plane = null
		gameEngine.airline?.planes.forEach(p => {
			if (!p.flying && p.maxDistance >= this.distance()) {
				plane = p
				console.log("picked plane",plane,this)
			} else {
				console.log("could not pick plane",p,p.flying,this)
			}
		})
		if (plane) {
			if (this.timeRemaining() <= 0) {
				plane = <Plane>plane
				plane.flying = true
				this.plane = plane
				return true
			} else {
				return false
			}
		}
		displayError("No planes available to run route, go to the Fleet tab")
		return false
	}
	run(): boolean {
		if (!this.canRun()) {
			return false
		}
		console.log("running route", this.lastRunAt, this.timeRemaining())
		this.lastRunAt = new Date()
		this.nextAvailableAt = new Date(new Date().getTime() + 60000 + 1000 * this.flightDuration())
		var airline = <Airline>gameEngine.airline
		airline.updateStats()
		airline.getRoutesDisplay()
		return true
	}
	getResults() {
		this.lastResultedAt = new Date()
		var numPassengers = this.dailyPassengers()
		var income = 10 * numPassengers
		var cost = 500 + Math.ceil(Math.random() * 500)
		var profit = income - cost
		displayInfo(`Route running with ${numPassengers} passengers earning ${prettyCashString(profit)} profit`)
		var airline = <Airline>gameEngine.airline
		airline.cash += profit
		var eventCost = 0
		var healthCost = 1
		var popularityChange = 1
		var incidentText, infoText = null
		if (Math.random() < 0.1) {
			eventCost = 2000 + Math.ceil(Math.random() * 2000)
			popularityChange = 5
			incidentText = `Engine fire costing ${prettyCashString(eventCost)} and ${popularityChange} reputation`
			infoText = "There was an engine fire! See Accidents tab for details"
			healthCost = 80
		} else if (Math.random() < 0.1) {
			eventCost = 100 + Math.ceil(Math.random() * 200)
			popularityChange = 1
			incidentText = `Smoke in cabin ${prettyCashString(eventCost)} and ${popularityChange} reputation`
			infoText = "Smoke in cabin! See Accidents tab for details"
			healthCost = 80
		}
		(<Plane>this.plane).health -= healthCost
		airline.cash -= eventCost;

		(<Plane>this.plane).flying = false
		this.plane = undefined
		airline.changePopularity( popularityChange)
		airline.updateStats()
		if (infoText) {
			displayInfo(infoText)
		}
		if (incidentText) {
			airline.incidents.push(`${new Date()} ${incidentText}`)
		}
		airline.getRoutesDisplay()
	}
	dailyPassengers(): number {
		return Math.ceil(this.popularity * (10 + Math.random() * 10))
	}
	buttonHtml(): HTMLButtonElement {
		var btn = document.createElement("button")
		btn.setAttribute("style", "background-color:#ddcc44aa")
		btn.appendChild(this.cardHtml())
		btn.addEventListener("click", () => {
			var airline = <Airline>gameEngine.airline
			if (airline.cash < this.purchaseCost) {
				displayError("You cannot afford this route!")
			} else {
				airline.routes.push(this)
				airline.cash -= this.purchaseCost
				airline.transactions.push(`${new Date()} $${airline.cash} Purchased route ${this.identifier} for ${prettyCashString(this.purchaseCost)}`)
				displayInfo("Route purchased!")
				gameEngine.displayRoutesTab()
				airline.updateStats()
			}
		})
		return btn
	}
	purchasedCardHtml(): HTMLDivElement {
		var div = document.createElement("div")
		div.className = "bg-light border-box"
		div.appendChild(this.cardHtml())
		var runbutton = document.createElement("button")
		var collectbutton = document.createElement("button")
		runbutton.innerHTML = "Run Route"
		runbutton.addEventListener("click", () => {
			if (this.run()) {
				runbutton.setAttribute("disabled", "")
				runbutton.innerHTML = `Current route running, ready in ${this.timeRemaining()} seconds ${this.plane?.name}`

			}
		})
		collectbutton.addEventListener("click", () => {
			this.getResults()
		})
		const updatebutton = () => {
			if (this.timeRemaining() === 0) {
				if (!this.lastRunAt || this.lastResultedAt && this.lastResultedAt > this.lastRunAt) {
					collectbutton.setAttribute("disabled", "")
					hideElement(collectbutton)
					if (this.nextAvailableAt && new Date() < this.nextAvailableAt) {
						runbutton.innerHTML = "Plane is Refueling, Cleaning, Unloading. Ready in 1 minute"
					} else {
						runbutton.innerHTML = "Run Route"
						runbutton.removeAttribute("disabled")
					}
				} else {
					collectbutton.style.display = "inherit"
					collectbutton.innerHTML = "Show Results"
					collectbutton.removeAttribute("disabled")
				}
			} else {
				runbutton.setAttribute("disabled", "")
				collectbutton.setAttribute("disabled", "")
				hideElement(collectbutton)
				runbutton.innerHTML = `Current route running, ready in ${this.timeRemaining()} seconds ${this.plane?.name}`

			}
		}
		setInterval(updatebutton, 1000)
		updatebutton()
		div.appendChild(runbutton)
		div.appendChild(collectbutton)
		return div

	}
	cardHtml(): HTMLElement {
		var dl = dataLabels([
			["Distance", `${this.distance().toLocaleString("en-gb", { maximumFractionDigits: 0 })}km`],
			["Popularity", this.popularity.toLocaleString("en-gb")],
			["Cost", `$${this.purchaseCost.toLocaleString("en-gb")}`],
		])
		var card = document.createElement("div")
		card.className = "flex flex-column justify-content-between"
		card.innerHTML = `<h3>${this.fromAirport.code} <-> ${this.toAirport.code}</h3>`
		card.appendChild(dl)
		var footer = document.createElement("div")
		var fromAirport = document.createElement("h5")
		fromAirport.innerHTML = this.fromAirport.name
		footer.appendChild(fromAirport)
		footer.appendChild(document.createElement("hr"))
		var toAirport = document.createElement("h5")
		toAirport.innerHTML = this.toAirport.name
		footer.appendChild(toAirport)
		card.appendChild(footer)
		return card
	}
}

class Plane {
	name: string
	id: number
	flying: boolean = false
	health: number = 100
	maxDistance: number = Math.floor(500 + Math.random() * 15000)
	cost: number = 100000 + this.maxDistance
	constructor(name: string, id: number) {
		this.name = name
		this.id = id
	}
	purchasedCardHtml(): HTMLElement {
		var div = document.createElement("div")
		div.className = "bg-light border-box"
		var dl = dataLabels([
			["Name", `${this.name}`],
			["Flying", `${this.flying}`],
			["Maxdistance", `${this.maxDistance}`],
			["health", this.health.toLocaleString("en-gb")],
		])
		var card = document.createElement("div")
		card.innerHTML = `<h3>${this.name} </h3>`
		card.appendChild(dl)
		div.appendChild(card)
		var status 
		
		if (!this.flying && this.health >= 30) {
			status = "Available"
		} else if (this.flying) {
			status = "inflight"
		} else {
			status = "maintenance"
			card.appendChild(this.maintenanceHtml())
		}
		card.className = `flex flex-column justify-content-between ${status}` 
		card.appendChild(createParagraph(status))
		return div
		
	}
	displayHtml(): HTMLElement {
		var div = document.createElement("div")
		div.className = "flex"
		div.appendChild(dataLabels([
			["id", String(this.id)],
			["name", this.name],
			["health", String(this.health)],
			["maxDistance", String(this.maxDistance)],
		]))
		return div
	}
	maintenanceHtml(): HTMLElement {
		var div = this.displayHtml()
		var btn = document.createElement("button")
		btn.innerText = "Fix for $100,000"
		div.appendChild(btn)
		btn.addEventListener("click", () => {
			var airline = <Airline>gameEngine.airline
			if (airline.cash < 100000) {
				displayError("You cannot afford this fix!")
				return
			}
			airline.cash -= 100000
			this.health = 100
			airline.transactions.push(`${new Date()} $100,000 Fixed plane ${this.id}`)
			displayInfo("Plane fixed!")
			gameEngine.displayFleetTab()
			airline.updateStats()
		})
		var btn = document.createElement("button")
		btn.innerText = "Sell to  Mojave scrapyard for $10,000"
		div.appendChild(btn)
		btn.addEventListener("click", () => {
			var airline = <Airline>gameEngine.airline
			airline.cash += 10000
			airline.transactions.push(`${new Date()} +$10,000 Sold plane ${this.id} to scrapyard`)
			displayInfo("Plane sold!")
			airline.planes = airline.planes.filter(p => p.id !== this.id)
			gameEngine.displayFleetTab()
			airline.updateStats()
		})
		return div
	}
}
function newPlane(existingPlanes: number): Plane {
	return new Plane(randomPlaneName(), existingPlanes + 1)
}
class Airline {
	name: string
	hub: Airport
	joined: Date
	cash: number = 1000000
	planes: Array<Plane> = []
	routes: Array<Route> = []
	popularity: number = 50
	transactions: Array<string> = []
	incidents: Array<string> = []

	constructor(name: string, hub: Airport) {
		this.name = name
		this.hub = hub
		this.joined = new Date()
	}
	changePopularity(amount: number): void {
		this.popularity += amount
		if (this.popularity <= 0) {
			gameEngine.gameOver()
		}
	}
	updateTitle(): void {
		var div = <HTMLElement>document.getElementById("airlineTitle")
		div.appendChild(this.titleHtml())

	}
	updateStats(): void {
		const placeholder = <HTMLElement>document.getElementById("airlineStats")
		placeholder.innerHTML = ""
		placeholder.appendChild(this.statsHtml())
	}
	sparePlanes(): number {
		return this.planes.length - this.routes.length
	}
	titleHtml(): HTMLElement {
		return createTitle(
			`${this.name}<strong>Hub: ${this.hub.code}</strong> <strong> Joined: ${this.joined.toLocaleDateString()} </strong>`,
			"h2",
		)
	}
	statsHtml(): HTMLElement {
		var dl = dataLabels([
			["Cash", prettyCashString(this.cash)],
			["Planes", String(this.planes.length)],
			["Routes", String(this.routes.length)],
			["Popularity", String(this.popularity)],
		])
		return dl
	}
	getFleetDisplay(): HTMLElement {
		var div = document.createElement("div")
		div.appendChild(createTitle("Your Fleet"))
		var planesContainer = document.createElement("div")
		this.planes.forEach(plane => {
		planesContainer.appendChild(plane.purchasedCardHtml())
		})
		div.appendChild(planesContainer)
		div.appendChild(createParagraph(`You have ${this.planes.length} planes in your fleet`))
		var button = document.createElement("button")
		button.setAttribute("style", "margin: 0.5rem")
		var plane = newPlane(this.planes.length)
		const airplaneCost = plane.cost
		div.appendChild(createParagraph(`You can buy another plane for ${prettyCashString(airplaneCost)}`))
		button.innerHTML = `Buy plane for ${prettyCashString(airplaneCost).toLocaleString()}`
		button.addEventListener("click", () => {
			if (this.cash >= airplaneCost) {
				this.cash -= airplaneCost
				this.transactions.push(`${new Date()} ${prettyCashString(this.cash)} Purchased plane for ${prettyCashString(airplaneCost)}`)
				this.planes.push(plane)
				this.updateStats()
				gameEngine.displayFleetTab()
			} else {
				displayError("You don't have enough cash to afford that plane!")
			}
		})
		div.appendChild( button)
		return div
	}
	getRoutesDisplay(): HTMLElement {
		var div = document.createElement("div")
		div.appendChild(createTitle("Your Routes"))
		var routesContainer = document.createElement("div")
		this.routes.forEach(route => {
			routesContainer.appendChild(route.purchasedCardHtml())
		})
		div.appendChild(routesContainer)
		return div
	}
	getReputationDisplay(): HTMLElement {
		var div = document.createElement("div")
		var heading = document.createElement("h2")
		heading.innerHTML = "Reputation and Reviews"
		div.appendChild(heading)

		var p = document.createElement("p")
		var numStars = 0
		if (this.popularity > 79) {
			p.innerText = `Customers favorite airline in ${this.hub.country}!`
			numStars = 5
		} else if (this.popularity > 49) {
			p.innerText = `Customers secound favorite choice`
			numStars = 3
		} else {
			p.innerText = `Customers least favorite choice`
			numStars = 1
		}
		for (var i = 0; i < 5; i++) {
			var span = document.createElement("span")
			span.className = "fa fa-star"
			if (i < numStars) {
				span.classList.add("checked")
			}
			div.appendChild(span)
		}
		div.appendChild(p)
		return div
	}
	getFinanceDisplay(): HTMLElement {
		var div = document.createElement("div")
		var heading = document.createElement("h3")
		heading.innerHTML = "Finances"
		div.appendChild(heading)
		this.transactions.forEach(t => {
			div.appendChild(createParagraph(t))
		})
		return div
	}
	getAccidentsDisplay(): HTMLElement {
		var div = document.createElement("div")
		var heading = document.createElement("h2")
		heading.innerHTML = "Accidents"
		div.appendChild(heading)
		this.incidents.forEach(t => {
			div.appendChild(createParagraph(t))
		})
		return div
	}
}

function getAirports(): Array<Airport> {
	return [
		// Europe
		new Airport("LHR", "London Heathrow", "United Kingdom", 51.4775, -0.461388, 80.1),
		new Airport("CDG", "Charles de Gaulle Airport", "France", 49.009722, 2.547778, 69.5),
		new Airport("FRA", "Frankfurt International Airport", "Germany", 50.0379, 8.5622, 71.0),
		// North America
		new Airport("JFK", "John F. Kennedy Airport", "USA", 40.6413, 73.7781, 71.9),
		new Airport("IAD", "Washington Dulles International Airport", "USA", 38.9531, 77.4565, 51.9),
		// South America
		// Asia
		new Airport("KUL", "Kuala Lumpur International Airport", "Malaysia", 2.743333, 101.698056, 60.0),
		new Airport("HKG", "Hong Kong International Airport", "Hong Kong", 22.308889, 113.914444, 71.4),
		new Airport("BKK", "Suvarnabhumi International Airport", "Thailand", 13.6900, 100.7501, 65.4),
		new Airport("SIN", "Changi International Airport", "Singapore", 1.3644, 103.9915, 91.0),
		// Africa
		new Airport("CPT", "Cape Town International Airport", "South Africa", 33.9715, 18.6021, 56.5),
		// Middle East
		new Airport("DXB", "Dubai International Airport", "UAE", 25.2532, 55.3657, 91.2),
	]
}

function createAirline(businessName: string, hub: Airport): Airline {
	var airline = new Airline(businessName, hub)
	displayInfo(businessName + " joins the aviation industry!")
	return airline
}

class GameEngine {
	airline?: Airline
	airports: Array<Airport> = []
	routes: Array<Route> = []
	days: number = 0
	today: Date = new Date()
	constructor() {
		this.loadAirports()
		this.loadRoutes()
	}
	registerAirline(airline: Airline): void {
		this.airline = airline
		displayInfo("Please Choose your new route.")
		this.displayRoutesTab()
	}

	progressDay(): void {
		this.days += 1
		this.today.setDate(this.today.getDate() + 1);
	}

	loadAirports(): Array<Airport> {
		if (this.airports.length === 0) {
			this.airports = getAirports()
		}
		return this.airports
	}
	loadRoutes(): Array<Route> {
		if (this.routes.length === 0) {
			var routes: Array<Route> = []
			this.airports.forEach(a => {
				this.airports.forEach(b => {
					if (a.code < b.code) {
						routes.push(new Route(a, b))
					}
				})
			})
			this.routes = routes
		}
		return this.routes
	}
	displaySummaryTab(): void {
		const main = <HTMLElement>document.getElementById("main")
		main.innerHTML = ""
		var airline = <Airline>this.airline
		var heading = createTitle(airline.name)
		main.appendChild(heading)
		main.appendChild(airline.getReputationDisplay())
		main.appendChild(airline.getAccidentsDisplay())
	}
	displayFleetTab(): void {
		const main = <HTMLElement>document.getElementById("main")
		main.innerHTML = ""
		var airline = <Airline>this.airline
		main.appendChild(airline.getFleetDisplay())
	}
	displayRoutesTab(): void {
		const main = <HTMLElement>document.getElementById("main")
		main.innerHTML = ""
		var airline = <Airline>this.airline
		main.appendChild(airline.getRoutesDisplay())
		main.appendChild(createTitle("Routes Available For Purchase"))
		var div = document.createElement("div")
		var unpurchasedRoutes = this.routes.filter(r => !this.airline?.routes.some(airlineRoute => airlineRoute.identifier === r.identifier))
		var routesForHub = unpurchasedRoutes.filter(r => r.fromAirport === this.airline?.hub || r.toAirport === this.airline?.hub)
		var routesToDisplay = routesForHub.sort((a, b) => a.distance() - b.distance()).slice(0,3)
		routesToDisplay.forEach(r => div.appendChild(r.buttonHtml()))
		main.appendChild(div)
	}
	displayReputationTab(): void {
		const main = <HTMLElement>document.getElementById("main")
		main.innerHTML = ""
		var airline = <Airline>this.airline
		main.appendChild(airline.getReputationDisplay())
	}
	displayFinanceTab(): void {
		const main = <HTMLElement>document.getElementById("main")
		main.innerHTML = ""
		var airline = <Airline>this.airline
		main.appendChild(airline.getFinanceDisplay())
	}
	displayAccidentsTab(): void {
		const main = <HTMLElement>document.getElementById("main")
		main.innerHTML = ""
		var airline = <Airline>this.airline
		main.appendChild(airline.getAccidentsDisplay())
	}
	getAirport(code: string): Airport | void {
		var airport;
		this.airports.forEach(a => {
			if (a.code === code) {
				airport = a
			}
		})
		return airport
	}
	showAirports(): void {
		const main = <HTMLElement>document.getElementById("main")
		this.airports.forEach((a) => {
			main.appendChild(a.cardHtml())
		})
	}
	showRoutes(): void {
		const main = <HTMLElement>document.getElementById("main")
		this.routes.forEach(r => {
			main.appendChild(r.cardHtml())
		})
	}
	gameOver(): void {
		const main = <HTMLElement>document.getElementById("main")
		main.innerHTML = "<h1 style='color:red;'>GAMEOVER</h1>"
	}
	createSideMenu(): void {
		var sideMenu = <HTMLElement>document.getElementById("sidemenu")
		var companyBtn = createElement("button", "viewCompany", "flex-grow", `Overview of ${(<Airline>this.airline).name}`)
		var fleetBtn = createElement("button", "viewFleet", "flex-grow", `Overview of Fleet`)
		var routesBtn = createElement("button", "viewRoutes", "flex-grow", `Overview of Routes`)
		var reputationBtn = createElement("button", "viewReputation", "flex-grow", `Overview of Reputation`)
		var financeBtn = createElement("button", "viewFinance", "flex-grow", `Overview of Finance`)
		var accidentsBtn = createElement("button", "viewAccidents", "flex-grow", `Overview of Accidents`)
		const main = <HTMLElement>document.getElementById("main")
		companyBtn.addEventListener("click", () => gameEngine.displaySummaryTab())
		fleetBtn.addEventListener("click", () => gameEngine.displayFleetTab())
		routesBtn.addEventListener("click", () => gameEngine.displayRoutesTab())
		reputationBtn.addEventListener("click", () => gameEngine.displayReputationTab())
		financeBtn.addEventListener("click", () => gameEngine.displayFinanceTab())
		accidentsBtn.addEventListener("click", () => gameEngine.displayAccidentsTab())
		sideMenu.appendChild(companyBtn)
		sideMenu.appendChild(fleetBtn)
		sideMenu.appendChild(routesBtn)
		sideMenu.appendChild(reputationBtn)
		sideMenu.appendChild(financeBtn)
		sideMenu.appendChild(accidentsBtn)
	}
}

//////// SETUP
var gameEngine: GameEngine = new GameEngine()

window.onload = () => {
	// Creating form to enter business name and to choose hub
	const form = <HTMLFormElement>document.getElementById("playForm")
	var nameRow = document.createElement("div")
	var nameLabel = document.createElement("label")
	nameLabel.setAttribute("for", "businessName")
	nameLabel.textContent = "What is your airline called?"
	var nameInput: HTMLInputElement = document.createElement("input")
	nameInput.setAttribute("type", "text")
	nameInput.setAttribute("name", "businessName")
	nameInput.setAttribute("required", "")
	nameRow.appendChild(nameLabel)
	nameRow.appendChild(nameInput)

	// choose hub
	var hubRow = document.createElement("div")
	var hubLabel = document.createElement("label")
	hubLabel.setAttribute("for", "hub")
	hubLabel.textContent = "Choose your hub"
	var hubSelect = <HTMLSelectElement>document.createElement("select")
	hubSelect.setAttribute("name", "hub")
	gameEngine.airports.map((airport) => {
		var opt = document.createElement("option")
		opt.setAttribute("value", airport.code)
		opt.textContent = `${airport.name} (${airport.code})`
		hubSelect.appendChild(opt)
		return opt
	})
	hubRow.appendChild(hubLabel)
	hubRow.appendChild(hubSelect)

	var playBtn = document.createElement("button")
	playBtn.setAttribute("type", "submit")
	playBtn.textContent = "Play Now"
	playBtn.className = "primary"
	form.innerHTML = ""
	form.appendChild(nameRow)
	form.appendChild(hubRow)
	form.appendChild(playBtn)
	nameInput.setAttribute("value", randomBusinessName())
	form.addEventListener("submit", (e) => {
		e.preventDefault()
		hideElement(form)
		var hub = <Airport>gameEngine.getAirport(hubSelect.value)
		var airline = createAirline(nameInput.value, hub)
		gameEngine.registerAirline(airline)
		const header = document.getElementsByTagName("header")[0]
		header?.classList.remove("justify-content-center")
		header?.classList.remove("flex-column")
		header?.classList.add("justify-content-between")
		gameEngine.createSideMenu()
		airline.updateTitle()
		airline.updateStats()
	})

}
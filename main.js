"use strict";

/*
 * Created with @iobroker/create-adapter v1.31.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");

// Load your modules here, e.g.:
// const fs = require("fs");
const fordApi = require("ffpass");




class Fordpass extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({
			...options,
			name: "fordpass",
		});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}

	/**
	 * Is called when databases are connected and adapter received configuration,
	 * initializes all properties
	 */
	async onReady() {
		this.log.info("Entering onReady");

		this.setObjectNotExistsAsync("VIN", {
			type: "state",
			common: {
				name: "VIN",
				type: "string",
				role: "text",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("lockStatus", {
			type: "state",
			common: {
				name: "Door Lock Status",
				type: "string",
				role: "text",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("odometer", {
			type: "state",
			common: {
				name: "Odometer",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("testOnly", {
			type: "state",
			common: {
				name: "Test Only",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("fuelLevel", {
			type: "state",
			common: {
				name: "Fuel Level in %",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("fuelDTE", {
			type: "state",
			common: {
				name: "Fuel Range",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("batterySoC", {
			type: "state",
			common: {
				name: "High Voltage Battery SoC",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("batteryDTE", {
			type: "state",
			common: {
				name: "Electric Range",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("latitude", {
			type: "state",
			common: {
				name: "GPS Latitude",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("longitude", {
			type: "state",
			common: {
				name: "GPS Longitude",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("oilLife", {
			type: "state",
			common: {
				name: "Oil Life",
				type: "string",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("oilLifeActual", {
			type: "state",
			common: {
				name: "Oil Life in %",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("batteryHealth", {
			type: "state",
			common: {
				name: "12V Battery Health",
				type: "string",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("batteryStatusActual", {
			type: "state",
			common: {
				name: "12V Battery Status Actual",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("tirePressure", {
			type: "state",
			common: {
				name: "Status Tire Pressure",
				type: "string",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});

		await main(this);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			callback();
		} catch (e) {
			callback();
		}
	}

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }

}


// @ts-ignore parent is a valid property on module
if (module.parent) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new Fordpass(options);
} else {
	// otherwise start the instance directly
	new Fordpass();
}

async function setStateAsync(object, stateName, vehicleData, valuePath) {
	// check if value exists
	if (!object || !vehicleData || !stateName || valuePath)
		return;

	const properties = valuePath.split(".");
	let prop;

	let value = vehicleData;
	for (let i = 0; i < properties.length; i++) {
		prop = properties[i];

		if (!value || !Object.prototype.hasOwnProperty.call(value, prop)) {
			return;
		} else {
			value = value[prop];
		}
	}

	await object.setStateAsync(stateName, { val: value, ack: true });
}

async function main(object) {
	object.log.info("Entering main");
	const car = new fordApi.vehicle(object.config.user, object.config.password, object.config.vin);
	await car.auth();
	const vehicleData = await car.status();

	object.log.info("Set states...");
	await setStateAsync(object, "VIN", vehicleData, "vin");
	await setStateAsync(object, "lockStatus", vehicleData, "lockStatus.value");
	await setStateAsync(object, "odometer", vehicleData, "odometer.value");
	await setStateAsync(object, "testOnly", vehicleData, "testOnly");
	await setStateAsync(object, "fuelLevel", vehicleData, "fuel.fuelLevel");
	await setStateAsync(object, "fuelDTE", vehicleData, "fuel.distanceToEmpty");
	await setStateAsync(object, "batterySoC", vehicleData, "batteryFillLevel.value");
	await setStateAsync(object, "batteryDTE", vehicleData, "elVehDTE.value");
	await setStateAsync(object, "latitude", vehicleData, "gps.latitude");
	await setStateAsync(object, "longitude", vehicleData, "gps.longitude");
	await setStateAsync(object, "oilLife", vehicleData, "oil.oilLife");
	await setStateAsync(object, "oilLifeActual", vehicleData, "oil.oilLifeActual");
	await setStateAsync(object, "batteryHealth", vehicleData, "battery.batteryHealth.value");
	await setStateAsync(object, "batteryStatusActual", vehicleData, "battery.batteryStatusActual.value");
	await setStateAsync(object, "tirePressure", vehicleData, "tirePressure.value");
	object.log.info("Set states completed");
}

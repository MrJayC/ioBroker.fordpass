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

		await this.declareStatesAsync();

		const car = new fordApi.vehicle(this.config.user, this.config.password, this.config.vin);
		await car.auth();
		const vehicleData = await car.status();

		this.log.info("Set states...");
		await this.publishVehicleDataAsync("VIN", vehicleData, "vin");
		await this.publishVehicleDataAsync("lockStatus", vehicleData, "lockStatus.value");
		await this.publishVehicleDataAsync("odometer", vehicleData, "odometer.value");
		await this.publishVehicleDataAsync("testOnly", vehicleData, "testOnly");
		await this.publishVehicleDataAsync("fuelLevel", vehicleData, "fuel.fuelLevel");
		await this.publishVehicleDataAsync("fuelDTE", vehicleData, "fuel.distanceToEmpty");
		await this.publishVehicleDataAsync("batterySoC", vehicleData, "batteryFillLevel.value");
		await this.publishVehicleDataAsync("batteryDTE", vehicleData, "elVehDTE.value");
		await this.publishVehicleDataAsync("latitude", vehicleData, "gps.latitude");
		await this.publishVehicleDataAsync("longitude", vehicleData, "gps.longitude");
		await this.publishVehicleDataAsync("oilLife", vehicleData, "oil.oilLife");
		await this.publishVehicleDataAsync("oilLifeActual", vehicleData, "oil.oilLifeActual");
		await this.publishVehicleDataAsync("batteryHealth", vehicleData, "battery.batteryHealth.value");
		await this.publishVehicleDataAsync("batteryStatusActual", vehicleData, "battery.batteryStatusActual.value");
		await this.publishVehicleDataAsync("tirePressure", vehicleData, "tirePressure.value");
		this.log.info("Set states completed");
	}

	async declareStatesAsync() {
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
	}

	async publishVehicleDataAsync(stateName, vehicleData, valuePath) {
		if (!vehicleData || !stateName || !valuePath)
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

		await this.setStateAsync(stateName, { val: value, ack: true });
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

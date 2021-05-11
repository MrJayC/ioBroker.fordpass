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
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		this.log.info("onReady entered");

		//const car = new fordApi.vehicle(this.config.user, this.config.password, this.config.vin);
		// Initialize your adapter here

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		/*
		this.log.info("config option1: " + this.config.user);
		this.log.info("config option2: " + this.config.password);
		this.log.info("config option2: " + this.config.vin);
		*/
		/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/
		//await car.auth();

		// to view current vehicle information including location
		//const vehicleData = await car.status();

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
		this.setObjectNotExistsAsync("Lockstatus", {
			type: "state",
			common: {
				name: "Lockstatus",
				type: "string",
				role: "text",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("Odometer", {
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
				name: "testOnly",
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
				name: "fuelLevel",
				type: "number",
				role: "value",
				read: true,
				write: false,
			},
			native: {},
		});
		this.setObjectNotExistsAsync("fueldistanceToEmpty", {
			type: "state",
			common: {
				name: "fueldistanceToEmpty",
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
				name: "Battery Health",
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
				name: "Battery Status Actual",
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

		/*
		this.setStateAsync("VIN", vehicleData.vin);
		this.setStateAsync("Lockstatus",vehicleData.lockStatus.value);
		this.setStateAsync("Odometer", vehicleData.odometer.value);
		this.setStateAsync("testOnly", vehicleData.testOnly.value);
		this.setStateAsync("fuelLevel",vehicleData.fuel.fuelLevel);
		this.setStateAsync("fueldistanceToEmpty", vehicleData.fuel.distanceToEmpty);
		this.setStateAsync("latitude",vehicleData.gps.latitude);
		this.setStateAsync("longitude", vehicleData.gps.longitude);
		this.setStateAsync("oilLife",vehicleData.oil.oilLife);
		this.setStateAsync("oilLifeActual", vehicleData.oil.oilLifeActual);
		this.setStateAsync("batteryHealth",vehicleData.battery.batteryHealth.value);
		this.setStateAsync("batteryStatusActual", vehicleData.battery.batteryStatusActual.value);
		this.setStateAsync("tirePressure", vehicleData.tirePressure.value);*/

		await main(this);

		//setInterval(main, this.config.interval, this);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

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

async function main(object) {
	object.log.info("Entering main");
	const car = new fordApi.vehicle(object.config.user, object.config.password, object.config.vin);
	await car.auth();
	const vehicleData = await car.status();

	object.log.info("Set states...");
	await object.setStateAsync("VIN", { val: vehicleData.vin, ack: true });
	await object.setStateAsync("Lockstatus", { val: vehicleData.lockStatus.value, ack: true });
	await object.setStateAsync("Odometer", { val: vehicleData.odometer.value, ack: true });
	await object.setStateAsync("testOnly", { val: vehicleData.testOnly.value, ack: true });
	await object.setStateAsync("fuelLevel", { val: vehicleData.fuel.fuelLevel, ack: true });
	await object.setStateAsync("fueldistanceToEmpty", { val: vehicleData.fuel.distanceToEmpty, ack: true });
	await object.setStateAsync("latitude", { val: vehicleData.gps.latitude, ack: true });
	await object.setStateAsync("longitude", { val: vehicleData.gps.longitude, ack: true });
	await object.setStateAsync("oilLife", { val: vehicleData.oil.oilLife, ack: true });
	await object.setStateAsync("oilLifeActual", { val: vehicleData.oil.oilLifeActual, ack: true });
	await object.setStateAsync("batteryHealth", { val: vehicleData.battery.batteryHealth.value, ack: true });
	await object.setStateAsync("batteryStatusActual", { val: vehicleData.battery.batteryStatusActual.value, ack: true });
	await object.setStateAsync("tirePressure", { val: vehicleData.tirePressure.value, ack: true });
	object.log.info("Set states completed");
}

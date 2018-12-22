/**
 *
 * kmcanio2 adapter
 *
 *
 *  file io-package.json comments:
 *
 *  {
 *      "common": {
 *          "name":         "kmcanio2",                  // name has to be set and has to be equal to adapters folder name and main file name excluDigitalInputg extension
 *          "version":      "0.0.0",                    // use "Semantic Versioning"! see http://semver.org/
 *          "title":        "Node.js kmcanio2 Adapter",  // Adapter title shown in User Interfaces
 *          "authors":  [                               // Array of authord
 *              "name <mail@kmcanio2.com>"
 *          ]
 *          "desc":         "kmcanio2 adapter",          // Adapter description shown in User Interfaces. Can be a language object {de:"...",ru:"..."} or a string
 *          "platform":     "Javascript/Node.js",       // possible values "javascript", "javascript/Node.js" - more coming
 *          "mode":         "daemon",                   // possible values "daemon", "schedule", "subscribe"
 *          "materialize":  true,                       // support of admin3
 *          "schedule":     "0 0 * * *"                 // cron-style schedule. Only needed if mode=schedule
 *          "loglevel":     "info"                      // Adapters Log Level
 *      },
 *      "native": {                                     // the native object is available via adapter.config in your adapters code - use it for configuration
 *          "test1": true,
 *          "test2": 42,
 *          "mySelect": "auto"
 *      }
 *  }
 *
 */

/* jshint -W097 */// jshint strict:false
/*jslint node: true */
'use strict';







// you have to require the utils module and call adapter function
const utils =    require(__dirname + '/lib/utils'); // Get common adapter utils

// you have to call the adapter function and pass a options object
// name has to be set and has to be equal to adapters folder name and main file name excluDigitalInputg extension
// adapter will be restarted automatically every time as the configuration changed, e.g system.adapter.kmcanio2.0
const adapter = new utils.Adapter('kmcanio2');

var can = require('socketcan');
var bus = can.createRawChannel("can0", true);
var txPDO1 = new Buffer([0,0,0,0,0,0,0,0]);

var KnownDevices = [];


// CAM CANIO Devices
var km_canio_buffers = [];
km_canio_buffers[0x01] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x02] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x03] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x04] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x05] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x06] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x07] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x08] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x09] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x0A] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x0B] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x0C] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x0D] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x0E] = new Buffer([0,0,0,0,0,0,0,0]);
km_canio_buffers[0x0F] = new Buffer([0,0,0,0,0,0,0,0]);


/*Variable declaration, since ES6 there are let to declare variables. Let has a more clearer definition where 
it is available then var.The variable is available inside a block and it's childs, but not outside. 
You can define the same variable name inside a child without produce a conflict with the variable of the parent block.*/
let variable = 1234;








// is called when adapter shuts down - callback has to be called under any circumstances!
adapter.on('unload', function (callback) {
    try {
        adapter.log.info('cleaned everything up...');
        callback();
    } catch (e) {
        callback();
    }
});

// is called if a subscribed object changes
adapter.on('objectChange', function (id, obj) {
    // Warning, obj can be null if it was deleted
    adapter.log.info('objectChange ' + id + ' ' + JSON.stringify(obj));
});

// is called if a subscribed state changes
adapter.on('stateChange', function (id, state) {

	adapter.log.info('---- stateChange ----');

    // Warning, state can be null if it was deleted
    //adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));
	
    adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));
	
	
	// kmcanio2.0.KMsmartIO_2.RelayOutput.K06
	
	var MyID = id.replace(adapter.namespace+".", "");
	
	// KMsmartIO_2.RelayOutput.K06
	var split_array = MyID.split(".");
	
	// [0]KMsmartIO_2 [1]RelayOutput [2]K06
	
	
	
	if( split_array.length==3 ){
		
		if( split_array[1]=="RelayOutput"){
			if( split_array[0].includes("KMsmartIO_") ){
				
				var DeviceName = split_array[0];
				
				var NodeID =  parseInt( split_array[0].replace("KMsmartIO_", "") );
				
				var RelayNumber = parseInt( split_array[2].replace("K", "") );
				var RelayByte = (RelayNumber-1)>>3;
				var RelayBit  = (RelayNumber-1)%8;
				
				adapter.log.info('NodeID ' + NodeID );
				adapter.log.info('RelayNumber ' + RelayNumber );
				adapter.log.info('RelayByte ' + RelayByte );
				adapter.log.info('RelayBit ' + RelayBit );
				
				
				if( typeof KnownDevices[DeviceName] === 'undefined' ){
					adapter.log.info('ERROR, DeviceVar not found!' );
					return;
				}else{
					
					adapter.log.info('Device: ' + DeviceName + ', K Nr. ' + RelayNumber );
					
					
					if( typeof KnownDevices[DeviceName]["K"+RelayNumber] === 'undefined' ){
						adapter.log.info('ERROR, DeviceVar Relay not found!' );
						return;
					}else{
						
						KnownDevices[DeviceName]["K"+RelayNumber] = state.val;
						
						var txMSG = new Buffer([0,0,0,0,0,0,0,0]);
						if( KnownDevices[DeviceName]["K1"]  == true ){ txMSG[0] |= 0x01; }
						if( KnownDevices[DeviceName]["K2"]  == true ){ txMSG[0] |= 0x02; }
						if( KnownDevices[DeviceName]["K3"]  == true ){ txMSG[0] |= 0x04; }
						if( KnownDevices[DeviceName]["K4"]  == true ){ txMSG[0] |= 0x08; }
						if( KnownDevices[DeviceName]["K5"]  == true ){ txMSG[0] |= 0x10; }
						if( KnownDevices[DeviceName]["K6"]  == true ){ txMSG[0] |= 0x20; }
						if( KnownDevices[DeviceName]["K7"]  == true ){ txMSG[0] |= 0x40; }
						if( KnownDevices[DeviceName]["K8"]  == true ){ txMSG[0] |= 0x80; }
						if( KnownDevices[DeviceName]["K9"]  == true ){ txMSG[1] |= 0x01; }
						if( KnownDevices[DeviceName]["K10"] == true ){ txMSG[1] |= 0x02; }
						if( KnownDevices[DeviceName]["K11"] == true ){ txMSG[1] |= 0x04; }
						if( KnownDevices[DeviceName]["K12"] == true ){ txMSG[1] |= 0x08; }
						if( KnownDevices[DeviceName]["K13"] == true ){ txMSG[1] |= 0x10; }
						if( KnownDevices[DeviceName]["K14"] == true ){ txMSG[1] |= 0x20; }
						if( KnownDevices[DeviceName]["K15"] == true ){ txMSG[1] |= 0x40; }
						if( KnownDevices[DeviceName]["K16"] == true ){ txMSG[1] |= 0x80; }
						if( KnownDevices[DeviceName]["K17"] == true ){ txMSG[2] |= 0x01; }
						if( KnownDevices[DeviceName]["K18"] == true ){ txMSG[2] |= 0x02; }
						
						var txid = NodeID + 0x200;
						bus.send({ id: txid, ext: false, data: txMSG });
						
					}
				}
			}
		}
	}
	
	
	
    // you can use the ack flag to detect if it is status (true) or command (false)
    if (state && !state.ack) {
        //adapter.log.info('ack is not set!');
    }
});

// Some message was sent to adapter instance over message box. Used by email, pushover, text2speech, ...
adapter.on('message', function (obj) {
    if (typeof obj === 'object' && obj.message) {
        if (obj.command === 'send') {
            // e.g. send email or pushover or whatever
            console.log('send command');

            // Send response in callback if required
            if (obj.callback) adapter.sendTo(obj.from, obj.command, 'Message received', obj.callback);
        }
    }
});

// is called when databases are connected and adapter received configuration.
// start here!
adapter.on('ready', function () {
    main();
});




function SetAndUpdateState( obj_id, obj_name, obj_value ){
	
	adapter.setObjectNotExists(obj_id, { 
		type: 'state', 
		common: { 
			name: obj_name, 
			type: 'boolean'
		}, 
		native: {} 
	});
	
		
	adapter.setState(obj_id, {val: obj_value, ack: true});
	
}


function UpdateObjectOnChange( DeviceName, VarName, obj_id, new_state ){
	if( KnownDevices[DeviceName][VarName] != new_state ){
		KnownDevices[DeviceName][VarName] = new_state;
		adapter.setState(obj_id, {val: new_state, ack: true});
	}
}




function main() {
	
	
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:
    adapter.log.info('Adapter Instance ID: ' + adapter.namespace);
    
	//canioInterface = adapter.config.canioInterface;
    //adapter.log.info('config canioInterface: ' + canioInterface);
	
	
	bus.start();
	
	setInterval( function(){ bus.send({ id: 0x080, ext: false, data: new Buffer([0,0,0,0,0,0,0,0]) }); }, 1*1000 );
	
	

	// CAN RECEIVE FUNCTION
	bus.addListener("onMessage", 
		function(msg) { 
			
			if( msg.id > 0x180 && msg.id < 0x280 ){
				
				var NodeID = msg.id - 0x180;
				var NodeType = "";
				var DeviceName = "";
				
				if( NodeID < 0x10 ){
					NodeType = "io";
					DeviceName = "KMsmartIO_" + NodeID;
				}else{
					NodeType = "in";
					DeviceName = "KMsmartIN_" + NodeID;
				}
				
				
				// Make New?
				if( typeof KnownDevices[DeviceName] === 'undefined' ){
					
					// Create Device Specific Vars
					var entry = [];
					
					// Create a object for Device Name
					adapter.setObjectNotExists(DeviceName, { 
						type: 'state', 
						common: { 
							name: "KMsmartHomeDevice", 
							type: 'number'
						}, 
						native: {} 
					});
					
					// Receive Counter
					entry["RXcnt"]  = 0;
					adapter.setObjectNotExists(DeviceName+".RXcnt", { type: 'state', common: { name: 'Receive Counter' , type: 'number' }, native: {} });
					
					
					if( NodeType == "io" ){
						
						// Create Digital Input Vars
						for( var i=0 ; i<=7 ; i++ ){
							// Local Copy
							entry["DI1."+i]  = false;
							entry["DI2."+i]  = false;
							entry["DI3."+i]  = false;
							
							// ioBroker Objects
							adapter.setObjectNotExists(DeviceName+".DI1."+i, { type: 'state', common: { name: 'Digital Input 1.'+i , type: 'boolean' }, native: {} });
							adapter.setObjectNotExists(DeviceName+".DI2."+i, { type: 'state', common: { name: 'Digital Input 2.'+i , type: 'boolean' }, native: {} });
							adapter.setObjectNotExists(DeviceName+".DI3."+i, { type: 'state', common: { name: 'Digital Input 3.'+i , type: 'boolean' }, native: {} });
						}
						
						
						// Create Relay Output Vars
						for( var i=1 ; i<=18 ; i++ ){
						
							// Local Copy
							entry["K"+i]  = false;
							
							// ioBroker Objects
							var obj_name = DeviceName+'.RelayOutput.K';
							if( i<10 ){ obj_name += '0'; }
							obj_name += i;
							adapter.setObjectNotExists(obj_name, { type: 'state', common: { name: 'Relay Output K'+i , type: 'boolean' }, native: {} });
							adapter.subscribeStates(obj_name);
							
						}
						
						
					}
					
					
					if( NodeType == "in" ){
						
						// Create Digital Input Vars
						for( var i=0 ; i<=7 ; i++ ){
							// Local Copy
							entry["DI1."+i]  = false;
							entry["DI2."+i]  = false;
							entry["DI3."+i]  = false;
							if( i<=3 ){ entry["DI4."+i]  = false; }
							
							// ioBroker Objects
							adapter.setObjectNotExists(DeviceName+".DI1."+i, { type: 'state', common: { name: 'Digital Input 1.'+i , type: 'boolean' }, native: {} });
							adapter.setObjectNotExists(DeviceName+".DI2."+i, { type: 'state', common: { name: 'Digital Input 2.'+i , type: 'boolean' }, native: {} });
							adapter.setObjectNotExists(DeviceName+".DI3."+i, { type: 'state', common: { name: 'Digital Input 3.'+i , type: 'boolean' }, native: {} });
							if( i<=3 ){ adapter.setObjectNotExists(DeviceName+".DI4."+i, { type: 'state', common: { name: 'Digital Input 4.'+i , type: 'boolean' }, native: {} }); }
						}
						
						// Temperatur Sensors
						adapter.setObjectNotExists(DeviceName+".OneWireBus.T1", { 
							type: 'state', 
							common: { 
								name: "OneWire Tempsensor 1 [°C]", 
								type: 'number'
							}, 
							native: {} 
						});
						entry["T1"]  = 0;
						
						
					}
					
					
					// Add the local Copy
					KnownDevices[DeviceName] = entry;
					
				}
				
				
				// RECEIVE
				KnownDevices[DeviceName]["RXcnt"]++;
				adapter.setState(DeviceName+".RXcnt", {val: KnownDevices[DeviceName]["RXcnt"], ack: true});
				
				
				if( NodeType == "in" || NodeType == "io" ){
					UpdateObjectOnChange( DeviceName, "DI1.0", DeviceName+".DI1.0", (msg.data[0]&0x01)>0 );
					UpdateObjectOnChange( DeviceName, "DI1.1", DeviceName+".DI1.1", (msg.data[0]&0x02)>0 );
					UpdateObjectOnChange( DeviceName, "DI1.2", DeviceName+".DI1.2", (msg.data[0]&0x04)>0 );
					UpdateObjectOnChange( DeviceName, "DI1.3", DeviceName+".DI1.3", (msg.data[0]&0x08)>0 );
					UpdateObjectOnChange( DeviceName, "DI1.4", DeviceName+".DI1.4", (msg.data[0]&0x10)>0 );
					UpdateObjectOnChange( DeviceName, "DI1.5", DeviceName+".DI1.5", (msg.data[0]&0x20)>0 );
					UpdateObjectOnChange( DeviceName, "DI1.6", DeviceName+".DI1.6", (msg.data[0]&0x40)>0 );
					UpdateObjectOnChange( DeviceName, "DI1.7", DeviceName+".DI1.7", (msg.data[0]&0x80)>0 );
					
					UpdateObjectOnChange( DeviceName, "DI2.0", DeviceName+".DI2.0", (msg.data[1]&0x01)>0 );
					UpdateObjectOnChange( DeviceName, "DI2.1", DeviceName+".DI2.1", (msg.data[1]&0x02)>0 );
					UpdateObjectOnChange( DeviceName, "DI2.2", DeviceName+".DI2.2", (msg.data[1]&0x04)>0 );
					UpdateObjectOnChange( DeviceName, "DI2.3", DeviceName+".DI2.3", (msg.data[1]&0x08)>0 );
					UpdateObjectOnChange( DeviceName, "DI2.4", DeviceName+".DI2.4", (msg.data[1]&0x10)>0 );
					UpdateObjectOnChange( DeviceName, "DI2.5", DeviceName+".DI2.5", (msg.data[1]&0x20)>0 );
					UpdateObjectOnChange( DeviceName, "DI2.6", DeviceName+".DI2.6", (msg.data[1]&0x40)>0 );
					UpdateObjectOnChange( DeviceName, "DI2.7", DeviceName+".DI2.7", (msg.data[1]&0x80)>0 );
					
					UpdateObjectOnChange( DeviceName, "DI3.0", DeviceName+".DI3.0", (msg.data[2]&0x01)>0 );
					UpdateObjectOnChange( DeviceName, "DI3.1", DeviceName+".DI3.1", (msg.data[2]&0x02)>0 );
					UpdateObjectOnChange( DeviceName, "DI3.2", DeviceName+".DI3.2", (msg.data[2]&0x04)>0 );
					UpdateObjectOnChange( DeviceName, "DI3.3", DeviceName+".DI3.3", (msg.data[2]&0x08)>0 );
					UpdateObjectOnChange( DeviceName, "DI3.4", DeviceName+".DI3.4", (msg.data[2]&0x10)>0 );
					UpdateObjectOnChange( DeviceName, "DI3.5", DeviceName+".DI3.5", (msg.data[2]&0x20)>0 );
					UpdateObjectOnChange( DeviceName, "DI3.6", DeviceName+".DI3.6", (msg.data[2]&0x40)>0 );
					UpdateObjectOnChange( DeviceName, "DI3.7", DeviceName+".DI3.7", (msg.data[2]&0x80)>0 );
				}
				
				if( NodeType == "in" ){
					UpdateObjectOnChange( DeviceName, "DI4.0", DeviceName+".DI4.0", (msg.data[3]&0x01)>0 );
					UpdateObjectOnChange( DeviceName, "DI4.1", DeviceName+".DI4.1", (msg.data[3]&0x02)>0 );
					UpdateObjectOnChange( DeviceName, "DI4.2", DeviceName+".DI4.2", (msg.data[3]&0x04)>0 );
					UpdateObjectOnChange( DeviceName, "DI4.3", DeviceName+".DI4.3", (msg.data[3]&0x08)>0 );
					
					var temp = (msg.data[4] + msg.data[5] * 256) * 0.0625;
					
					UpdateObjectOnChange( DeviceName, "T1", DeviceName+".OneWireBus.T1", temp );
					
				}
				
				
				
				/*
				2018-12-22
				
				// Create a object for Device Name
				adapter.setObjectNotExists(DeviceName, { 
					type: 'state', 
					common: { 
						name: "KMsmartHomeDevice", 
						type: 'number'
					}, 
					native: {} 
				});
				
				
				// Same Input Vars for Smart-IN and Smart-IO
				SetAndUpdateState( DeviceName+".DI1.0", "Digital Input 1.0", (msg.data[0]&0x01)>0 ); 
				SetAndUpdateState( DeviceName+".DI1.1", "Digital Input 1.1", (msg.data[0]&0x02)>0 ); 
				SetAndUpdateState( DeviceName+".DI1.2", "Digital Input 1.2", (msg.data[0]&0x04)>0 ); 
				SetAndUpdateState( DeviceName+".DI1.3", "Digital Input 1.3", (msg.data[0]&0x08)>0 ); 
				SetAndUpdateState( DeviceName+".DI1.4", "Digital Input 1.4", (msg.data[0]&0x10)>0 ); 
				SetAndUpdateState( DeviceName+".DI1.5", "Digital Input 1.5", (msg.data[0]&0x20)>0 ); 
				SetAndUpdateState( DeviceName+".DI1.6", "Digital Input 1.6", (msg.data[0]&0x40)>0 ); 
				SetAndUpdateState( DeviceName+".DI1.7", "Digital Input 1.7", (msg.data[0]&0x80)>0 ); 
				
				SetAndUpdateState( DeviceName+".DI2.0", "Digital Input 2.0", (msg.data[1]&0x01)>0 ); 
				SetAndUpdateState( DeviceName+".DI2.1", "Digital Input 2.1", (msg.data[1]&0x02)>0 ); 
				SetAndUpdateState( DeviceName+".DI2.2", "Digital Input 2.2", (msg.data[1]&0x04)>0 ); 
				SetAndUpdateState( DeviceName+".DI2.3", "Digital Input 2.3", (msg.data[1]&0x08)>0 ); 
				SetAndUpdateState( DeviceName+".DI2.4", "Digital Input 2.4", (msg.data[1]&0x10)>0 ); 
				SetAndUpdateState( DeviceName+".DI2.5", "Digital Input 2.5", (msg.data[1]&0x20)>0 ); 
				SetAndUpdateState( DeviceName+".DI2.6", "Digital Input 2.6", (msg.data[1]&0x40)>0 ); 
				SetAndUpdateState( DeviceName+".DI2.7", "Digital Input 2.7", (msg.data[1]&0x80)>0 ); 
				
				SetAndUpdateState( DeviceName+".DI3.0", "Digital Input 3.0", (msg.data[2]&0x01)>0 ); 
				SetAndUpdateState( DeviceName+".DI3.1", "Digital Input 3.1", (msg.data[2]&0x02)>0 ); 
				SetAndUpdateState( DeviceName+".DI3.2", "Digital Input 3.2", (msg.data[2]&0x04)>0 ); 
				SetAndUpdateState( DeviceName+".DI3.3", "Digital Input 3.3", (msg.data[2]&0x08)>0 ); 
				SetAndUpdateState( DeviceName+".DI3.4", "Digital Input 3.4", (msg.data[2]&0x10)>0 ); 
				SetAndUpdateState( DeviceName+".DI3.5", "Digital Input 3.5", (msg.data[2]&0x20)>0 ); 
				SetAndUpdateState( DeviceName+".DI3.6", "Digital Input 3.6", (msg.data[2]&0x40)>0 ); 
				SetAndUpdateState( DeviceName+".DI3.7", "Digital Input 3.7", (msg.data[2]&0x80)>0 ); 
				
				// Smart-IN specific
				if( NodeType == "in" ){
					SetAndUpdateState( DeviceName+".DI4.0", "Digital Input 4.0", (msg.data[3]&0x01)>0 ); 
					SetAndUpdateState( DeviceName+".DI4.1", "Digital Input 4.1", (msg.data[3]&0x02)>0 ); 
					SetAndUpdateState( DeviceName+".DI4.2", "Digital Input 4.2", (msg.data[3]&0x04)>0 ); 
					SetAndUpdateState( DeviceName+".DI4.3", "Digital Input 4.3", (msg.data[3]&0x08)>0 ); 
					
					var temp = (msg.data[4] + msg.data[5] * 256) * 0.0625;
					
					
					adapter.setObjectNotExists(DeviceName+".OneWireBus.T1", { 
						type: 'state', 
						common: { 
							name: "OneWire Tempsensor 1 [°C]", 
							type: 'number'
						}, 
						native: {} 
					});
					
					adapter.setState(DeviceName+".OneWireBus.T1", {val: temp.toFixed(2), ack: true});
					
					SetAndUpdateState( DeviceName+".OneWireBus.T1", "OneWire Tempsensor 1 [°C]", temp.toFixed(2) );
				}
				
				*/
			}
			
			
		} 
	);
	
	
	
	// Timer Test
	
	
	//var buf = new Buffer([1,2,3,4,5,6,7,8]);
	//bus.send({ id: 12, ext: false, data: buf });
	
    // in this kmcanio2 all states changes inside the adapters namespace are subscribed
    //adapter.subscribeStates('*');


    /**
     *   setState examples
     *
     *   you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
     *
     */
	 

    // the variable testVariable is set to true as command (ack=false)
 //   adapter.setState('testVariable', true);

    // same thing, but the value is flagged "ack"
    // ack should be always set to true if the value is received from or acknowledged from the target system
    

    // same thing, but the state is deleted after 30s (getState will return null afterwards)
  //  adapter.setState('testVariable', {val: true, ack: true, expire: 30});




}

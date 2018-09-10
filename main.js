/**
 *
 * kmcanio adapter
 *
 *
 *  file io-package.json comments:
 *
 *  {
 *      "common": {
 *          "name":         "kmcanio",                  // name has to be set and has to be equal to adapters folder name and main file name excluDigitalInputg extension
 *          "version":      "0.0.0",                    // use "Semantic Versioning"! see http://semver.org/
 *          "title":        "Node.js kmcanio Adapter",  // Adapter title shown in User Interfaces
 *          "authors":  [                               // Array of authord
 *              "name <mail@kmcanio.com>"
 *          ]
 *          "desc":         "kmcanio adapter",          // Adapter description shown in User Interfaces. Can be a language object {de:"...",ru:"..."} or a string
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
// adapter will be restarted automatically every time as the configuration changed, e.g system.adapter.kmcanio.0
const adapter = new utils.Adapter('kmcanio');

var can = require('socketcan');
var bus = can.createRawChannel("can0", true);
var txPDO1 = new Buffer([0,0,0,0,0,0,0,0]);

var NodeType;
var NodeID;



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
    // Warning, state can be null if it was deleted
    //adapter.log.info('stateChange ' + id + ' ' + JSON.stringify(state));
	
	
	if( NodeType == "io" ){
	
		if( id == (adapter.namespace + '.RelayOutput.K01') ){ if( state.val==true ){ txPDO1[0] |= 0x01; }else{ txPDO1[0] &= ~0x01; } }
		if( id == (adapter.namespace + '.RelayOutput.K02') ){ if( state.val==true ){ txPDO1[0] |= 0x02; }else{ txPDO1[0] &= ~0x02; } }
		if( id == (adapter.namespace + '.RelayOutput.K03') ){ if( state.val==true ){ txPDO1[0] |= 0x04; }else{ txPDO1[0] &= ~0x04; } }
		if( id == (adapter.namespace + '.RelayOutput.K04') ){ if( state.val==true ){ txPDO1[0] |= 0x08; }else{ txPDO1[0] &= ~0x08; } }
		if( id == (adapter.namespace + '.RelayOutput.K05') ){ if( state.val==true ){ txPDO1[0] |= 0x10; }else{ txPDO1[0] &= ~0x10; } }
		if( id == (adapter.namespace + '.RelayOutput.K06') ){ if( state.val==true ){ txPDO1[0] |= 0x20; }else{ txPDO1[0] &= ~0x20; } }
		if( id == (adapter.namespace + '.RelayOutput.K07') ){ if( state.val==true ){ txPDO1[0] |= 0x40; }else{ txPDO1[0] &= ~0x40; } }
		if( id == (adapter.namespace + '.RelayOutput.K08') ){ if( state.val==true ){ txPDO1[0] |= 0x80; }else{ txPDO1[0] &= ~0x80; } }
		if( id == (adapter.namespace + '.RelayOutput.K09') ){ if( state.val==true ){ txPDO1[1] |= 0x01; }else{ txPDO1[1] &= ~0x01; } }
		if( id == (adapter.namespace + '.RelayOutput.K10') ){ if( state.val==true ){ txPDO1[1] |= 0x02; }else{ txPDO1[1] &= ~0x02; } }
		if( id == (adapter.namespace + '.RelayOutput.K11') ){ if( state.val==true ){ txPDO1[1] |= 0x04; }else{ txPDO1[1] &= ~0x04; } }
		if( id == (adapter.namespace + '.RelayOutput.K12') ){ if( state.val==true ){ txPDO1[1] |= 0x08; }else{ txPDO1[1] &= ~0x08; } }
		if( id == (adapter.namespace + '.RelayOutput.K13') ){ if( state.val==true ){ txPDO1[1] |= 0x10; }else{ txPDO1[1] &= ~0x10; } }
		if( id == (adapter.namespace + '.RelayOutput.K14') ){ if( state.val==true ){ txPDO1[1] |= 0x20; }else{ txPDO1[1] &= ~0x20; } }
		if( id == (adapter.namespace + '.RelayOutput.K15') ){ if( state.val==true ){ txPDO1[1] |= 0x40; }else{ txPDO1[1] &= ~0x40; } }
		if( id == (adapter.namespace + '.RelayOutput.K16') ){ if( state.val==true ){ txPDO1[1] |= 0x80; }else{ txPDO1[1] &= ~0x80; } }
		if( id == (adapter.namespace + '.RelayOutput.K17') ){ if( state.val==true ){ txPDO1[2] |= 0x01; }else{ txPDO1[2] &= ~0x01; } }
		if( id == (adapter.namespace + '.RelayOutput.K18') ){ if( state.val==true ){ txPDO1[2] |= 0x02; }else{ txPDO1[2] &= ~0x02; } }
		
		var txid = NodeID + 512;
		
		bus.send({ id: txid, ext: false, data: txPDO1 });
	
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

function main() {
	
	
    // The adapters config (in the instance object everything under the attribute "native") is accessible via
    // adapter.config:
    adapter.log.info('Adapter Instance ID: ' + adapter.namespace);
    
	NodeType = adapter.config.canioNodeType;
	NodeID = parseInt(adapter.config.canioNodeID);
    adapter.log.info('config canioNodeType: ' + NodeType);
    adapter.log.info('config canioNodeID: ' + NodeID);
	
	
	bus.start();
	
	// Define Objects:
	// ---------------------------------------------------------------------------------------------------------------------
    adapter.setObject('DigitalInput.10', { type: 'state', common: { name: 'Digital Input 1.0', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.11', { type: 'state', common: { name: 'Digital Input 1.1', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.12', { type: 'state', common: { name: 'Digital Input 1.2', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.13', { type: 'state', common: { name: 'Digital Input 1.3', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.14', { type: 'state', common: { name: 'Digital Input 1.4', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.15', { type: 'state', common: { name: 'Digital Input 1.5', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.16', { type: 'state', common: { name: 'Digital Input 1.6', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.17', { type: 'state', common: { name: 'Digital Input 1.7', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.20', { type: 'state', common: { name: 'Digital Input 2.0', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.21', { type: 'state', common: { name: 'Digital Input 2.1', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.22', { type: 'state', common: { name: 'Digital Input 2.2', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.23', { type: 'state', common: { name: 'Digital Input 2.3', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.24', { type: 'state', common: { name: 'Digital Input 2.4', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.25', { type: 'state', common: { name: 'Digital Input 2.5', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.26', { type: 'state', common: { name: 'Digital Input 2.6', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.27', { type: 'state', common: { name: 'Digital Input 2.7', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.30', { type: 'state', common: { name: 'Digital Input 3.0', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.31', { type: 'state', common: { name: 'Digital Input 3.1', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.32', { type: 'state', common: { name: 'Digital Input 3.2', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.33', { type: 'state', common: { name: 'Digital Input 3.3', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.34', { type: 'state', common: { name: 'Digital Input 3.4', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.35', { type: 'state', common: { name: 'Digital Input 3.5', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.36', { type: 'state', common: { name: 'Digital Input 3.6', type: 'boolean', role: 'indicator' }, native: {} });
    adapter.setObject('DigitalInput.37', { type: 'state', common: { name: 'Digital Input 3.7', type: 'boolean', role: 'indicator' }, native: {} });
	
	if( NodeType == "in" ){
		adapter.setObject('DigitalInput.40', { type: 'state', common: { name: 'Digital Input 4.0', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('DigitalInput.41', { type: 'state', common: { name: 'Digital Input 4.1', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('DigitalInput.42', { type: 'state', common: { name: 'Digital Input 4.2', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('DigitalInput.43', { type: 'state', common: { name: 'Digital Input 4.3', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('T1', { type: 'state', common: { name: '1-Wire Temperatur Sensor 1', type: 'number', role: 'indicator' }, native: {} });
	}
	
	
	if( NodeType == "io" ){
		adapter.setObject('RelayOutput.K01', { type: 'state', common: { name: 'Relay Output K1' , type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K02', { type: 'state', common: { name: 'Relay Output K2' , type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K03', { type: 'state', common: { name: 'Relay Output K3' , type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K04', { type: 'state', common: { name: 'Relay Output K4' , type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K05', { type: 'state', common: { name: 'Relay Output K5' , type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K06', { type: 'state', common: { name: 'Relay Output K6' , type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K07', { type: 'state', common: { name: 'Relay Output K7' , type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K08', { type: 'state', common: { name: 'Relay Output K8' , type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K09', { type: 'state', common: { name: 'Relay Output K9' , type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K10', { type: 'state', common: { name: 'Relay Output K10', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K11', { type: 'state', common: { name: 'Relay Output K11', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K12', { type: 'state', common: { name: 'Relay Output K12', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K13', { type: 'state', common: { name: 'Relay Output K13', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K14', { type: 'state', common: { name: 'Relay Output K14', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K15', { type: 'state', common: { name: 'Relay Output K15', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K16', { type: 'state', common: { name: 'Relay Output K16', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K17', { type: 'state', common: { name: 'Relay Output K17', type: 'boolean', role: 'indicator' }, native: {} });
		adapter.setObject('RelayOutput.K18', { type: 'state', common: { name: 'Relay Output K18', type: 'boolean', role: 'indicator' }, native: {} });
		
		adapter.subscribeStates('RelayOutput.K01');
		adapter.subscribeStates('RelayOutput.K02');
		adapter.subscribeStates('RelayOutput.K03');
		adapter.subscribeStates('RelayOutput.K04');
		adapter.subscribeStates('RelayOutput.K05');
		adapter.subscribeStates('RelayOutput.K06');
		adapter.subscribeStates('RelayOutput.K07');
		adapter.subscribeStates('RelayOutput.K08');
		adapter.subscribeStates('RelayOutput.K09');
		adapter.subscribeStates('RelayOutput.K10');
		adapter.subscribeStates('RelayOutput.K11');
		adapter.subscribeStates('RelayOutput.K12');
		adapter.subscribeStates('RelayOutput.K13');
		adapter.subscribeStates('RelayOutput.K14');
		adapter.subscribeStates('RelayOutput.K15');
		adapter.subscribeStates('RelayOutput.K16');
		adapter.subscribeStates('RelayOutput.K17');
		adapter.subscribeStates('RelayOutput.K18');
		
	}
	
	
	bus.addListener("onMessage", 
		function(msg) { 
			if( msg.id == (0x180 + NodeID) ){
				
				// Same Input Vars for Smart-IN and Smart-IO
				if(  msg.data[0] & 0x01 ){ adapter.setState('DigitalInput.10', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.10', {val: false, ack: true}); }
				if(  msg.data[0] & 0x02 ){ adapter.setState('DigitalInput.11', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.11', {val: false, ack: true}); }
				if(  msg.data[0] & 0x04 ){ adapter.setState('DigitalInput.12', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.12', {val: false, ack: true}); }
				if(  msg.data[0] & 0x08 ){ adapter.setState('DigitalInput.13', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.13', {val: false, ack: true}); }
				if(  msg.data[0] & 0x10 ){ adapter.setState('DigitalInput.14', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.14', {val: false, ack: true}); }
				if(  msg.data[0] & 0x20 ){ adapter.setState('DigitalInput.15', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.15', {val: false, ack: true}); }
				if(  msg.data[0] & 0x40 ){ adapter.setState('DigitalInput.16', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.16', {val: false, ack: true}); }
				if(  msg.data[0] & 0x80 ){ adapter.setState('DigitalInput.17', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.17', {val: false, ack: true}); }
				
				if(  msg.data[1] & 0x01 ){ adapter.setState('DigitalInput.20', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.20', {val: false, ack: true}); }
				if(  msg.data[1] & 0x02 ){ adapter.setState('DigitalInput.21', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.21', {val: false, ack: true}); }
				if(  msg.data[1] & 0x04 ){ adapter.setState('DigitalInput.22', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.22', {val: false, ack: true}); }
				if(  msg.data[1] & 0x08 ){ adapter.setState('DigitalInput.23', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.23', {val: false, ack: true}); }
				if(  msg.data[1] & 0x10 ){ adapter.setState('DigitalInput.24', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.24', {val: false, ack: true}); }
				if(  msg.data[1] & 0x20 ){ adapter.setState('DigitalInput.25', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.25', {val: false, ack: true}); }
				if(  msg.data[1] & 0x40 ){ adapter.setState('DigitalInput.26', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.26', {val: false, ack: true}); }
				if(  msg.data[1] & 0x80 ){ adapter.setState('DigitalInput.27', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.27', {val: false, ack: true}); }
				
				if(  msg.data[2] & 0x01 ){ adapter.setState('DigitalInput.30', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.30', {val: false, ack: true}); }
				if(  msg.data[2] & 0x02 ){ adapter.setState('DigitalInput.31', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.31', {val: false, ack: true}); }
				if(  msg.data[2] & 0x04 ){ adapter.setState('DigitalInput.32', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.32', {val: false, ack: true}); }
				if(  msg.data[2] & 0x08 ){ adapter.setState('DigitalInput.33', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.33', {val: false, ack: true}); }
				if(  msg.data[2] & 0x10 ){ adapter.setState('DigitalInput.34', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.34', {val: false, ack: true}); }
				if(  msg.data[2] & 0x20 ){ adapter.setState('DigitalInput.35', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.35', {val: false, ack: true}); }
				if(  msg.data[2] & 0x40 ){ adapter.setState('DigitalInput.36', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.36', {val: false, ack: true}); }
				if(  msg.data[2] & 0x80 ){ adapter.setState('DigitalInput.37', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.37', {val: false, ack: true}); }
				
				// Smart-IN specific
				if( NodeType == "in" ){
					if(  msg.data[3] & 0x01 ){ adapter.setState('DigitalInput.40', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.40', {val: false, ack: true}); }
					if(  msg.data[3] & 0x02 ){ adapter.setState('DigitalInput.41', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.41', {val: false, ack: true}); }
					if(  msg.data[3] & 0x04 ){ adapter.setState('DigitalInput.42', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.42', {val: false, ack: true}); }
					if(  msg.data[3] & 0x08 ){ adapter.setState('DigitalInput.43', {val: true, ack: true}); }else{ adapter.setState('DigitalInput.43', {val: false, ack: true}); }
					
					var temp = (msg.data[4] + msg.data[5] * 256) * 0.0625;
					adapter.setState('T1', {val: temp.toFixed(2), ack: true});
				}
				
			}
		} 
	);
	
	
	
	//var buf = new Buffer([1,2,3,4,5,6,7,8]);
	//bus.send({ id: 12, ext: false, data: buf });
	
    // in this kmcanio all states changes inside the adapters namespace are subscribed
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

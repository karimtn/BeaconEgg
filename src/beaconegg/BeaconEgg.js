;(function(win, doc, ns) {

    "use strict";

    /**
     * iBeacon 
     * @constructor
     * @extends adhr.EventDispatcher
     */
    function BeaconEgg() {
        win.beaconegg = this;
        this.regions  = [];
    }

    BeaconEgg.prototype = new ns.EventDispatcher;

    /**
     * @const {string}
     */
    BeaconEgg.EVENT_ENTER_REGION = 'adhr.beaconegg.event.enter.region';

    /**
     * @const {string}
     */
    BeaconEgg.EVENT_EXIT_REGION = 'adhr.beaconegg.event.exit.region';

    /**
     * @const {string}
     */
    BeaconEgg.EVENT_RENGE = 'adhr.beaconegg.event.renge';

    /**
     * @param {string} uuid region uuid
     * @return {integer}
     */
    BeaconEgg.prototype.findRegionIndexByUUID = function (uuid) {
        var _regions = this.regions.concat([]);
        for (var i = 0; i < _regions.length; ++i) {
            if (_regions[i].uuid === uuid) {
                return i;
            }
        }
    }

    /**
     * @param {string} uuid region uuid
     * @return {adhr.Region}
     */
    BeaconEgg.prototype.findRegionByUUID = function (uuid) {
        return this.regions[this.findRegionIndexByUUID(uuid)];
    }

    /**
     * redirect to start monitoring
     * @param  {adhr.Region} region Region object
     * @return {void}
     */
    BeaconEgg.prototype.startMonitoring = function(region) {
        this.regions.push(region);
        location.href = 'beaconegg://egg/start-monitoring?proximityUUID=' + region.uuid + '&id=' + region.id;
    };

    /**
     * redirect to stop monitoring
     * @param  {adhr.Region} region Region object
     * @return {void}
     */
    BeaconEgg.prototype.stopMonitoring = function(region) {
        this.regions.splice(this.findRegionIndexByUUID(region.uuid), 1);
        location.href = 'beaconegg://egg/stop-monitoring?proximityUUID=' + region.uuid;
    };

    /**
     * dispatch event to enter region
     * @param  {hash} data beacon data
     * @return {void}
     */
    BeaconEgg.prototype.didEnterRegion = function(data) {
        this.dispatchEvent(BeaconEgg.EVENT_ENTER_REGION, this.findRegionByUUID(data.proximityUUID));
    }

    /**
     * dispatch event to exit region
     * @param  {hash} data beacon data
     * @return {void}
     */
    BeaconEgg.prototype.didExitRegion = function(data) {
        this.dispatchEvent(BeaconEgg.EVENT_EXIT_REGION, this.findRegionByUUID(data.proximityUUID));
    }

    /**
     * dispatch event to renge
     * @param  {hash} data beacon data
     * @return {void}
     */
    BeaconEgg.prototype.didRenge = function(data) {
        var beacons = [];
        for (var i = 0; i < data.beacons.length; i++) {
            beacons.push(new ns.Beacon(data.beacons[i]));
        }
        this.dispatchEvent(BeaconEgg.EVENT_RENGE, beacons);
    }

    // Export
    ns.BeaconEgg = BeaconEgg;

}(this, document, adhr));
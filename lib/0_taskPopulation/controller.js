StructureController.prototype.report = function () {
 //if our max energy capacity has been reached for given rcl
 //if (this.room.energyCapacity == CONTROLLER_STRUCTURES.extension[this.room.rcl]*EXTENSION_ENERGY_CAPACITY[this.room.rcl]) {
 //push to task array
 CM.set(this.pos.x, this.pos.y, 255);
 this.room.memory.jobs.upgrade.push(this.id);
 //}
};

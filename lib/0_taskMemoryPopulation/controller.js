StructureController.prototype.report = function() {
  //if our max energy capacity has been reached for given rcl
  //if (this.room.energyCapacity == CONTROLLER_STRUCTURES.spawn[this.room.rcl] * SPAWN_ENERGY_CAPACITY + CONTROLLER_STRUCTURES.extension[this.room.rcl] * EXTENSION_ENERGY_CAPACITY[this.room.rcl]) {
    //push to task array
    Memory.rooms[this.room.name].frog.upgrade.push(this.id);
    Memory.rooms[this.room.name].toad.upgrade.push(this.id);
    //console.log(Memory.rooms[this.room.name].frog.upgrade);
  //}
};

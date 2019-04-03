StructureController.prototype.report = function() {
    this.room.visual.circle(this.pos,
    {fill: 'transparent', radius: 3, stroke: 'orange'});
  //if our max energy capacity has been reached for given rcl
  //if (this.room.energyCapacity == CONTROLLER_STRUCTURES.spawn[this.room.rcl] * SPAWN_ENERGY_CAPACITY + CONTROLLER_STRUCTURES.extension[this.room.rcl] * EXTENSION_ENERGY_CAPACITY[this.room.rcl]) {
  //push to task array
  if (this.my && this.level == 8) {
    //console.log('UPGRADE: pushing ' + this.room.memory.controller.id + ' to ' + this.room.name);
    //if I control the controller
   Memory.rooms[this.room.name].frog.upgrade.push(this.id);
  }else if(this.my){
    Memory.rooms[this.room.name].toad.upgrade.push(this.id);
    Memory.rooms[this.room.name].frog.upgrade.push(this.id);
  }else{
    Memory.rooms[this.room.name].squatter.squat.push(this.id);
  }
};

StructureSpawn.prototype.report = function() {
    if(this.energy < this.energyCapacity){
      //add to deposit array
      this.room.memory.deposit[this.id] = this.energy;
    }
};

StructureSpawn.prototype.debrief = function() {
  if(this.energy === this.energyCapacity){
    delete this.room.memory.deposit[this.id];
  }
};

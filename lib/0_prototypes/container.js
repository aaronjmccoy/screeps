StructureContainer.prototype.report = function() {
    if(this.store.energy > 0){
      //add to gather object
      this.room.memory.gather[this.id] = this.energy;
    }
};
StructureContainer.prototype.debrief = function() {
  if(this.store.energy === 0){
    delete this.room.memory.gather[this.id];
  }
};

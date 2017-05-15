StructureStorage.prototype.report = function() {
    if(this.reportFlag === 0 && this.store.energy > 0){
      //add to gather object
      this.room.memory.gather[this.id] = this.energy;
      //set sort flag
      this.room.memory.sortGather = 1;
      //report is true because container is ready for withdrawal
      this.reportFlag = 1;
    }
};
StructureStorage.prototype.debrief = function() {
  if(this.reportFlag === 1 && this.store.energy === 0){
    delete this.room.memory.gather[this.id];
    //report is empty because container is empty
    this.reportFlag = 0;
  }
};

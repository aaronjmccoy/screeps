StructureTower.prototype.report = function() {
    if(this.reportFlag === 0 && this.energy < this.energyCapacity){
      //add to deposit array
      this.room.memory.deposit[this.id] = this.energy;
      //set sort flag
      this.room.memory.sortDeposit = 1;
      //report is true because we need to fill this extension
      this.reportFlag = 1;
    }
};

StructureTower.prototype.debrief = function() {
  if(this.reportFlag === 1 && this.energy === this.energyCapacity){
    delete this.room.memory.deposit[this.id];
    //report is false because tower is full
    this.reportFlag = 0;
  }
};

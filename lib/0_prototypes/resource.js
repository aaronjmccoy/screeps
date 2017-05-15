Resource.prototype.report = function() {
    //add to sweep array
    this.room.memory.sweep.[this.id] = this.amount;
    //set sort flag
    //set sort flag
    this.room.memory.sortSweep = 1;
};

Resource.prototype.debrief = function() {
    delete this.room.memory.sweep.[this.id];
};

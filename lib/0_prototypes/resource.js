Resource.prototype.report = function() {
    //add to sweep array
    this.room.memory.sweep.[this.id] = this.amount;
};

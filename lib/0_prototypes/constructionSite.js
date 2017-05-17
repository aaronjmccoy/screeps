ConstructionSite.prototype.report = function() {
    //add to gather object
    this.room.memory.construct[this.id] = this.hits;
};

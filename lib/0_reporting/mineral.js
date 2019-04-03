Mineral.prototype.report = function() {
  this.room.createConstructionSite(this.pos.x, this.pos.y, this.pos.roomName);
};

Creep.prototype.claimer = function() {
  //move to claim target and claim
  this.moveTo(new RoomPosition(19, 15, 'E3S8'));
  this.claimController(this.room.controller);
  this.signController(this.room.controller, "Ribbit");
};

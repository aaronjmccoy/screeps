Resource.prototype.report = function() {
  if (this.resourceType == 'energy') {
     var pushes = Math.min(Math.ceil(this.amount/300), 8) ;
     for(var iStore = 0; iStore < pushes;iStore++){
          Memory.rooms[this.room.name].newt.collect.push(this.id);
     }
    Memory.rooms[this.room.name].frog.sweep.push(this.id);
    Memory.rooms[this.room.name].newt.sweep.push(this.id);
    Memory.rooms[this.room.name].toad.sweep.push(this.id);
    Memory.rooms[this.room.name].minnow.sweep.push(this.id);
  } else {
    Memory.rooms[this.room.name].caecilian.sweep.push(this.id);
  }
};

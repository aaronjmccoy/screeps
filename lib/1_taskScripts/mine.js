/*jshint -W008 */
//// HARVEST PLUS ////
Creep.prototype.mine = function () {
 if (this.memory.tasks.mine) {
  switch (this.harvest(Game.getObjectById(this.memory.tasks.mine))) {
  case 0:
   let look = this.pos.look();
   let resourceCount = 0;
   look.forEach(function (lookObject) {
    if (lookObject.type == LOOK_RESOURCES) {
     resourceCount += 1;
    }
   });
   if (resourceCount > 0) {
    this.moveTo(Game.getObjectById(this.memory.tasks.mine));
   }
   return Memory.emoji.mine;
  case -9:
   //set move
   CM.set(this.pos.x, this.pos.y, 0);
   this.moveTo(Game.getObjectById(this.memory.tasks.mine), {
    reusePath: 20,
    visualizePathStyle: {
     fill: 'transparent',
     stroke: '#eeff99',
     lineStyle: 'solid',
     strokeWidth: .15,
     opacity: .1
    }
   });
   return Memory.emoji.hop;
  case -6:
   //if the mine is empty go eat
   if (this.requestTask('eat')) {
    return this.eat();
   } else {
    return 'zzz';
   }
  }

 }
 return this.harvest(Game.getObjectById(this.memory.tasks.mine));
};

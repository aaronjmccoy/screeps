//// RENEWCREEP PLUS ////
Creep.prototype.eat = function () {
 this.transfer(Game.getObjectById(this.memory.eat), RESOURCE_ENERGY);
 switch (Game.getObjectById(this.memory.eat).renewCreep(this)) {
 case 0:
  //no need to clear memory for eat, creep eat at their convenience as an endpoint
  return Memory.emoji['eat'];
 case -6:
 case -7:
 case -8:
  //creep timer is full OR
  //spawn doesn't have enough energy OR
  //object is not a creep
  //move at random for now
  this.move(Math.floor(Math.random() * (8)));
  return Memory.emoji['oops'] + Memory.emoji['eat'] + Memory.emoji['oops'];
 case -9:
  //set move
  this.moveTo(Game.getObjectById(this.memory.eat), {
   visualizePathStyle: {
    fill: 'transparent',
    stroke: '#00eeff',
    lineStyle: 'solid',
    strokeWidth: .15,
    opacity: .1
   }
  });
  return Memory.emoji['frog'];
 }
}


// LAZINESS PROTOTYPES //

//sacrifice action
Creep.prototype.sacrifice = function () {
 return Game.getObjectById(this.memory.eat).recycleCreep(this);
};

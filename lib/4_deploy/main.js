function eraseDead() {
 for (var i in Memory.creeps) {
  if (!Game.creeps[i]) {
   delete Memory.creeps[i];
  }
 }

}
//first clear memory
//erase dead creep
eraseDead();
//export my loop logic
module.exports.loop = function () {
 //trigger reports for construction sites
 for (let id in Game.ConstructionSites) {
  this.room.memory.jobs.build.tasks[id] = id;
 }
 //then trigger structure prototypes to populate energy delivery arrays
 for (let id in Game.structures) {
  var structure = Game.structures[id];
  switch (structure.structureType) {
  case 'spawn':
   if (structure.memory.queen) {
    queen(structure);
   }
   structure.report();
   break;
  case 'extension':
   structure.report();
   break;
  case 'container':
   structure.report();
   break;
  case 'storage':
   structure.report();
   break;
  case 'tower':
   tower(structure);
   structure.report();
   break;
  }
 }
 //then trigger creep behavior
 for (let name in Game.creeps) {
  var creep = Game.creeps[name];
  switch (creep.memory.role) {
  case 'redspawn':
   redspawn(creep);
   break;
  case 'tadpole':
   tadpole(creep);
   break;
  case 'frog':
   frog(creep);
   break;
  case 'toad':
   toad(creep);
   break;
  case 'newt':
   newt(creep);
   break;
  case 'squatter':
   squatter(creep);
   break;
  case 'poliwog':
   poliwog(creep);
   break;
  }
 }
};
//graphs
//collect_stats();

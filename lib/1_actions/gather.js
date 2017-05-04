//takes an array of deposit target IDs and gathers from them in the order given
//until each are full
function gather(creep) {
    const resourceType = creep.memory.resourceType;
    var target =_.max(creep.memory.from, function(containerID) {
        return Game.getObjectById(containerID).store[RESOURCE_ENERGY];
    });
    //console.log('target: '+target);
    var containerMax = Game.getObjectById(target);
    if(containerMax){
      //if the target has at least as much energy as the creep can hold currently
      if (containerMax.store[resourceType] >= 50) {
          // gather resources
          if (creep.withdraw(containerMax, resourceType) == ERR_NOT_IN_RANGE) {
              creep.moveTo(containerMax);
              creep.withdraw(containerMax, resourceType);
          }
          //return true to end loop after resources transfer or don't for the first valid target
          return true;
      }
      creep.moveTo(Game.getObjectById(creep.memory.from[0]));
    }else{
      creep.moveTo(Game.getObjectById(creep.memory.from[0]));
    }
}

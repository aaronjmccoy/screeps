//takes an array of deposit target IDs and deposits into them in the order given
//until each are full
function deposit(creep) {
  const resourceType = creep.memory.resourceType;
    //for each item in the to Array
    for (let id in creep.memory.to) {
        if (creep.memory.to[id]){
          //create an object from the id
          var target = Game.getObjectById(creep.memory.to[id]);
          //if the target has at least as much energy as the creep can hold currently
          if ((target.energy < target.energyCapacity)||(_.sum(target.carry) < target.carryCapacity)||(_.sum(target.store) < target.storeCapacity)) {
              // gather resources
              //console.log('deposit target:'+target);
              if (creep.transfer(target, resourceType) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(target);
                  creep.transfer(target, resourceType);
              }
              //return true to end loop after resources transfer or don't for the first valid target
              return true;
          }else{
            creep.moveTo(target);
          }
        }
    }
}

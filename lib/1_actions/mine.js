function assignSpot(creep){
  for(let source in Memory.rooms[creep.room.name].sources){
    if(Memory.rooms[creep.room.name].lastAssignedSource == source){
      continue;
    }
    for(let spot in Memory.rooms[creep.room.name].sources[source].spots){
      if(!Game.getObjectById(Memory.rooms[creep.room.name].sources[source].spots[spot])){
          Memory.rooms[creep.room.name].sources[source].spots[spot] = creep.id;
          Memory.rooms[creep.room.name].lastAssignedSource = source;
          return source;
        }else if(creep.memory.priority > Game.getObjectById(Memory.rooms[creep.room.name].sources[source].spots[spot]).memory.priority){
          Game.getObjectById(Memory.rooms[creep.room.name].sources[source].spots[spot]).suicide();
          Memory.rooms[creep.room.name].sources[source].spots[spot] = creep.id;
          Memory.rooms[creep.room.name].lastAssignedSource = source;
          return source;
        }
    }
  }
  return creep.pos.findClosestByRange(FIND_SOURCES).id;
}

function mine(creep) {
    if(!creep.memory.mine){
      creep.memory.mine = assignSpot(creep);
    }
    var target = Game.getObjectById(creep.memory.mine);
    switch (creep.harvest(target)) {
        case 0:
            //creep successfuly mined
            creep.say('$', true);
            //if our miner has a to designation try to deposit immediately
            if (creep.memory.to && creep.memory.role == 'toad') {
                var minerContainer = Game.getObjectById(creep.memory.to);
                creep.moveTo(minerContainer);
                creep.upgradeController(creep.room.controller);
                //transfer unless containers are full
                if (creep.transfer(minerContainer, creep.memory.resourceType) < 0) {
                    //if containers are full attempt to drop into storage
                    if(creep.transfer(creep.room.storage, creep.memory.resourceType) < 0){
                      //else upgrade if possible
                      creep.upgradeController(creep.room.controller);
                    }
                }
            }else{
              if(creep.memory.role == 'toad'){
                creep.upgradeController(creep.room.controller);
              }
            }
            break;
        case -1:
            //don't own the creep or source is claimed
            creep.say('¯\\_(ツ)_/¯', false);
            break;
        case -4:
            //creep is busy
            creep.say('I\'m busy', false);
            break;
        case -5:
            //Extractor not found?
            creep.say('¯\\_(ツ)_/¯', false);
            break;
        case -6:
            //out of energy in source
            creep.say('Empty', false);
            creep.moveTo(target);

            //for when sim works again
            if (creep.memory.renew === true && creep.ticksToLive < 1000) {
                creep.memory.important = 'eat';
            }

            break;
        case -7:
            //invalid target
            creep.say('Bad Target', false);
            break;
        case -9:
            //move in
            creep.moveTo(target);
            return creep.harvest(target);
        case -12:
            //no work body parts
            creep.say('¯\\_(ツ)_/¯', false);
            break;
    }
}

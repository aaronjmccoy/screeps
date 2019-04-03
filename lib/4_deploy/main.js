//export my loop logic
module.exports.loop = function() {
  //start by initializing memory and cost matrixes per room
  for (var r in Memory.rooms) {
    var room = Game.rooms[r];
    if (room) {
      //console.log(room.name);
      room.initializeMemory();
      //create memory structure
      room.memory.roles = {
        frog: 0,
        newt: 0,
        toad: 0,
        squatter: 0,
        minnow: 0,
        shark: 0
      };
    }else{
     Memory.rooms[r] = {};
    }
  }
  //populate each task in each room with vision
  for (var _r in Memory.rooms) {
    var room = Game.rooms[_r];
    //console.log("initializing memory for "+_r);
    if (room) {
      //console.log("initializing memory for "+room);
      //if the room has a parent
      if (Memory.rooms[room.name].parentRoom) {
        //queue tasks with parent room
        console.log('PARENT: '+Memory.rooms[room.name].parentRoom+' -> CHILD:'+room.name);
        room.queueTasks(Memory.rooms[room.name].parentRoom);
        //if it has a child
      } else if (Memory.rooms[room.name].children) {
        for (var c = 0; c < Memory.rooms[room.name].children.length; c++) {
          var child = Memory.rooms[room.name].children[c];
          console.log(room.name+':'+child);
          //if the child room has a stored controller id
          if(!Memory.rooms[child]){
              Memory.rooms[child] = {};
          }
          console.log(Game.getObjectById(room.memory.observer).observeRoom(child));
            Memory.rooms[room.name].observedLast = child;
          if (!Memory.rooms[child].controller) {
            console.log(Game.getObjectById(room.memory.observer).observeRoom(child));
            Memory.rooms[room.name].observedLast = child;
          }else{
            //push the controller ID of the child room to the parent room squat tasks
            room.memory.squatter.squat.push(Memory.rooms[child].controller.id);
          }
        }
        //console.log('CHILD: '+Memory.rooms[room.name].childRoom+' -> PARENT:'+room.name)
        room.queueTasks();
      } else {
        //no kids
        //console.log('NO CHILD: '+room.name);
        room.queueTasks();
      }
    }else{
        //console.log("No vision in "+_r);
    }
  }
  //call role code to address tasks in memory
  //first structures
  for (var s in Game.structures) {
    var structure = Game.structures[s];
    switch (structure.structureType) {
      case 'tower':
        tower(structure);
        break;
      case 'spawn':
        //Memory.spawns[structure.name] = {"queen":true};
        if (Memory.spawns[structure.name].queen) {
          queen(structure);
        }
        break;
      case 'observer':
          console.log("observer in room "+structure.room.name);
          Memory.rooms[structure.room.name].observer = structure.id;
          console.log('We have vision in '+structure.pos.roomName);

        break;
    }
  }


  //then creeps
  for (var name in Memory.creeps) {
    //clearing of the dead from memory
    if (!Game.creeps[name]) {
      //clear creep work registration
      delete Memory.creeps[name];
      //then keep iterating over other creeps
    } else if (Game.creeps[name]) {
      var creep = Game.creeps[name];
      //var roomMaxed = false;

      if (creep.ticksToLive < 420) {
        creep.memory.hungry = true;
      }
      if (creep.ticksToLive > 1000) {
        creep.memory.hungry = false;
      }
      creep.memory.room = creep.name.split('_')[2];
      switch (creep.memory.role) {
        case 'newt':
          creep.say(creep.newt());
          break;
        case 'frog':
          creep.say(creep.frog());
          break;
        case 'squatter':
          creep.say(creep.squatter());
          break;
        case 'toad':
          creep.say(creep.toad());
          break;
        case 'shark':
          creep.say(creep.shark());
          break;
        case 'claimer':
          creep.say(creep.claimer());
          break;
        case 'minnow':
          creep.say(creep.minnow());
          break;
      }
    }
  }
};

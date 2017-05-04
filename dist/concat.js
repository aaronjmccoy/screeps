function initialize(r) {
    //initialize room if not already initialized

    Memory.rooms[r.name] = {};
    if (!Memory.rooms[r.name].sc) {
        Memory.rooms[r.name].sc = (findSources(r).length);
    }
    if (!Memory.rooms[r.name].pc) {
        Memory.rooms[r.name].pc = (Memory.rooms[r.name].sc * 3000);
    }
    if (!Memory.rooms[r.name].pt) {
        Memory.rooms[r.name].pt = Math.ceil(Memory.rooms[r.name].pc / 300);
    }
    if (!Memory.rooms[r.name].miningSpots) {
        Memory.rooms[r.name].miningSpots = r.miningSpots();
    }
}

function findSources(r) {
    return r.find(FIND_SOURCES);
}

function spawner(spawn) {
    const r = spawn.room;
    if (!Memory.rooms[r.name]) {
        initialize(r);
    }
    const rcl = r.controller.level;
    //creep list
    spawn.memory.creepList = {
        //redspawns only upgrade controller to lvl 2 and then build extensions
        redspawn: {
            count: (rcl < 3 ? Memory.rooms[r.name].miningSpots + 1 : 2),
            parts: [MOVE, CARRY, MOVE, WORK],
            options: {
                role: 'redspawn',
                important: 'mine',
                upgrade: r.controller.id,
                resourceType: RESOURCE_ENERGY,
                max: (rcl < 3 ? Memory.rooms[r.name].miningSpots + 1 : 2),
                priority: 1
            }
        },

        //after redspawns build the first 5 extensions make tadpoles
        tadpole: {
            count: (r.miningSpots() <= Memory.rooms[r.name].sc * 6 ? r.miningSpots() : Memory.rooms[r.name].sc * 6),
            parts: [MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, WORK, WORK],
            options: {
                role: 'tadpole',
                important: 'mine',
                upgrade: r.controller.id,
                resourceType: RESOURCE_ENERGY,
                priority: 2
            }
        },
        //tadpoles build first extensions, then containers, then upgrade the controller

        //TIER I SPECIALIZATION : RCL3
        // 10 Extensions, 1 Spawn = 800 Energy
        // UPGRADE | HARVEST | CONSTRUCT | CARRY | COST

        //frogs build and upgrade
        //frogs are responsible for the first tower
        // 4 | 8 | 20 | 200 | 800

        frog: {
            count: ((Memory.rooms[r.name].sc * 2)+1),
            parts: [MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, WORK, WORK, WORK, WORK],
            options: {
                role: 'frog',
                important: 'gather',
                upgrade: r.controller.id,
                resourceType: RESOURCE_ENERGY,
                priority: 3
            }
        },

        //toads harvest energy then transfer it to some adjacent storage
        //miners may upgrade during mining downtime if upgraders are within range
        //miners may be the single class that renewing is valuable on for uninterrupted mining
        // 6 | 12 | 30 | 50 | 800
        toad: {
            count: (Memory.rooms[r.name].sc),
            parts: (rcl < 6 ? [MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK] :
              [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK]),
            options: {
                role: 'toad',
                important: 'mine',
                resourceType: RESOURCE_ENERGY,
                home: spawn.id,
                renew: true,
                priority: (r.rcl < 6 ? 3 : 4)
            }
        },

        //newts haul to extensions and spawn
        // 0 | 0 | 0 | 500 | 750
        newt: {
            count: 2,
            parts: [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
            options: {
                role: 'newt',
                important: 'gather',
                resourceType: RESOURCE_ENERGY,
                priority: 3
            }
        }
    };
    //spawn logic
    //rcl switch
    let rs = spawn.memory.creepList.redspawn;
    let tp = spawn.memory.creepList.tadpole;
    let frog = spawn.memory.creepList.frog;
    let toad = spawn.memory.creepList.toad;
    let newt = spawn.memory.creepList.newt;
    switch (rcl) {
        case 1:
            //console.log('spawner listed max redspawn: ' + rs.count);
            //if we haven't hit our creep count limit for redspawn, create more
            if (r.roleCount('redspawn') < rs.count) {
                spawn.createCreep(rs.parts, Game.time + '_' + rs.options.role, rs.options);
            }
            break;
        case 2:
            //if we haven't hit our creep count limit for redspawn, create more
            if (r.roleCount('redspawn') < rs.count - r.roleCount('tadpole')) {
                spawn.createCreep(rs.parts, Game.time + '_' + rs.options.role, rs.options);
            }
            //if we haven't hit our creep count limit for redspawn, create more
            if (r.roleCount('tadpole') < tp.count) {
                spawn.createCreep(tp.parts, Game.time + '_' + tp.options.role, tp.options);
            }
            break;
        case 3:
            if (r.roleCount('redspawn') < rs.count - r.roleCount('newt')) {
                spawn.createCreep(rs.parts, Game.time + '_' + rs.options.role, rs.options);
            }
            if (r.roleCount('tadpole') < (tp.count) - r.roleCount('toad') * 6) {
                spawn.createCreep(tp.parts, Game.time + '_' + tp.options.role, tp.options);
            }
            if (r.roleCount('toad') < toad.count) {
                spawn.createCreep(toad.parts, Game.time + '_' + toad.options.role, toad.options);
            } else
            if (r.roleCount('newt') < newt.count) {
                spawn.createCreep(newt.parts, Game.time + '_' + newt.options.role, newt.options);
            } else
            if (r.roleCount('frog') < frog.count) {
                spawn.createCreep(frog.parts, Game.time + '_' + frog.options.role, frog.options);
            }
            break;
        case 4:
            if (r.roleCount('toad') < toad.count) {
                spawn.createCreep(toad.parts, Game.time + '_' + toad.options.role, toad.options);
            } else
            if (r.roleCount('newt') < 2) {
                spawn.createCreep(newt.parts, Game.time + '_' + newt.options.role, newt.options);
            } else
            if (r.roleCount('frog') < frog.count) {
                spawn.createCreep(frog.parts, Game.time + '_' + frog.options.role, frog.options);
            }
            break;
        case 5:
            if (r.roleCount('toad') < toad.count) {
                spawn.createCreep(toad.parts, Game.time + '_' + toad.options.role, toad.options);
            } else
            if (r.roleCount('newt') < newt.count) {
                spawn.createCreep(newt.parts, Game.time + '_' + newt.options.role, newt.options);
            } else
            if (r.roleCount('frog') < frog.count) {
                spawn.createCreep(frog.parts, Game.time + '_' + frog.options.role, frog.options);
            }
            break;
        case 6:
        if (r.roleCount('toad') < toad.count) {
            spawn.createCreep(toad.parts, Game.time + '_' + toad.options.role, toad.options);
        } else
        if (r.roleCount('newt') < newt.count) {
            spawn.createCreep(newt.parts, Game.time + '_' + newt.options.role, newt.options);
        } else
        if (r.roleCount('frog') < frog.count) {
            spawn.createCreep(frog.parts, Game.time + '_' + frog.options.role, frog.options);
        }
            break;
        case 7:

            break;
    }
}

Room.prototype.roleCount = function(roleString) {
    //console.log('counting '+roleString+'s in '+this.name);
    let count = this.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == roleString});
    //console.log(count.length);
    return count.length;
};
Room.prototype.roleIDs = function(roleString) {
    let idArray = [];
    //console.log('counting '+roleString+'s in '+this.name);
    let creepArray = this.find(FIND_MY_CREEPS, {filter: (c) => c.memory.role == roleString});
    for (var creep in creepArray) {
        idArray.push(creepArray[creep].id);
    }
    return idArray;
};
Room.prototype.containerIDs = function() {
    let idArray = [];
    let containerArray = this.find(FIND_STRUCTURES, {filter : (c) => c.structureType == STRUCTURE_CONTAINER});
    for (var container in containerArray) {
        idArray.push(containerArray[container].id);
    }
    return idArray;
};
Room.prototype.extensionIDs = function() {
    let idArray = [];
    let extensionArray = this.find(FIND_MY_STRUCTURES, {filter: (c) => c.structureType == STRUCTURE_EXTENSION});
    for (var extension in extensionArray) {
        idArray.push(extensionArray[extension].id);
    }
    return idArray;
};
Room.prototype.spawnerIDs = function() {
    let idArray = [];
    let spawnerArray = this.find(FIND_MY_STRUCTURES, {filter: (c) => c.structureType == STRUCTURE_SPAWN});
    for (let spawn in spawnerArray) {
        idArray.push(spawnerArray[spawn].id);
    }
    return idArray;
};
Room.prototype.towerIDs = function() {
    let idArray = [];
    let towerArray = this.find(FIND_MY_STRUCTURES, {filter: (c) => c.structureType == STRUCTURE_TOWER});
    for (let tower in towerArray) {
        idArray.push(towerArray[tower].id);
    }
    return idArray;
};
Room.prototype.storageIDs = function() {
    let idArray = [];
    let storageArray = this.find(FIND_STRUCTURES, {filter: (c) => c.structureType == STRUCTURE_STORAGE});
    for (let storage in storageArray) {
        idArray.push(storageArray[storage].id);
    }
    return idArray;
};
//counts open spots around sources
Room.prototype.miningSpots= function () {
    //initialize vars
    var r = this;
    var miningspots = 0;
    var area = [];
    //get the pos of each source
    var sources = r.find(FIND_SOURCES);
    //Peek at the result by uncommenting the line below
    //console.log("sources: "+JSON.stringify(sources));
    sources.forEach(
            function(source) {
                //Iterate over the source
                //console.log("source: "+source)
                //search the 3x3 grid with the source at the center
                var sid = source.id;
                //console.log(sid);
                area = (r.lookForAtArea('terrain', (source.pos.y) - 1, (source.pos.x) - 1, (source.pos.y) + 1, (source.pos.x) + 1, true));
                //console.log("result: "+JSON.stringify(area.length));
                for (var j = 0; j < area.length; j++) {
                    //uncomment to see the grid printed
                    //console.log(j+": "+JSON.stringify(area[j]));
                    if (area[j].terrain == ('plain') ||  area[j].terrain == ('swamp')) {
                        miningspots++;
                        //console.log(miningspots);
                        //if the terrain is swamp or plain add a mining spot
                        if(!Memory.rooms[r.name].sources){
                          Memory.rooms[r.name].sources = {};
                        }
                        if(!Memory.rooms[r.name].sources[sid]){
                          Memory.rooms[r.name].sources[sid] = {};
                        }
                        if(!Memory.rooms[r.name].sources[sid].spots){
                          Memory.rooms[r.name].sources[sid].spots = {};
                        }
                        if(!Memory.rooms[r.name].sources[sid].spots[miningspots]){
                          Memory.rooms[r.name].sources[sid].spots[miningspots] = 'empty';
                        }
                        //console.log(sid);
                    }
                }
            }
        );
        //Peek at the result by uncommenting the line below
        //console.log("countMiningSpots: " + JSON.stringify(miningspots));
        return miningspots;
};

function build(creep) {
  //Find closest construction site and store in memory
  if(creep.memory.colony){
    creep.memory.target = Game.getObjectById(creep.memory.colony);
  }else{
    creep.memory.target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
  }

    //if no target is successfully stored
    if (!creep.memory.target || creep.memory.target === null) {
        //upgrade instead
        if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.room.controller);
            creep.upgradeController(creep.room.controller);
        }
    }
    //otherwise build at the site
    else if(creep.build(creep.memory.target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.memory.target);
        creep.build(creep.memory.target);
    }
    creep.moveTo(creep.memory.target);
}

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

function eat(creep) {
    var spawn = Game.getObjectById(creep.memory.home);
    //console.log(spawn.renewCreep(creep));
    if (spawn.renewCreep(creep) == ERR_NOT_IN_RANGE) {
        creep.moveTo(spawn);
    }

    switch (spawn.renewCreep(creep)) {
        case 0:
            //creep successfuly eats
            creep.say('NOM', true);
            break;
        case -1:
            //don't own the spawn
            creep.say('¯\\_(ツ)_/¯', false);
            break;
        case -4:
            //spawn is busy
            creep.say('Waiting', false);
            break;
        case -6:
            //out of energy in spawn array
            creep.say('Empty', false);
            creep.memory.important = 'mine';
            break;
        case -7:
            //invalid target
            creep.say('Bad Target', false);
            break;
        case -8:
            //creep is full
            creep.memory.important = 'mine';
            break;
    }
}

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

function upgrade(creep) {
    if (creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
        creep.moveTo(creep.room.controller);
        creep.upgradeController(creep.room.controller);
    }
}

// Callback is a class (use with new) that stores functions to call
// back later, and they're called with a specified object.

function Callback() {
    this.handlers = [];  // observers
}

Callback.prototype = {

    subscribe: function(fn) {
        this.handlers.push(fn);
    },

    unsubscribe: function(fn) {
        this.handlers = this.handlers.filter(
            function(item) {
                if (item !== fn) {
                    return item;
                }
            }
        );
    },

    fire: function(o, thisObj) {
        // TODO: Put error handling around the call?
        this.handlers.forEach(function(item) {
            try {
                item.call(thisObj, o);
                //console.log('called ', item.name, 'with', o);
            } catch (err) {
                console.log('Ignored error calling back ', item.name, 'with', o, '-', err);
            }
        });
    }
};

// Resources Module handles determining what sort of mode we should be operating in.
//
// CRITICAL, LOW, NORMAL
//
// The mode is based upon a combination of factors, including:
//   Room Controller Level
//   Room Structures - Storage, Container
//   Room Sources (probably a linear relationship to other things like minimum stored energy)

// Things which are expected to vary based upon the resource mode, room level, and sources:
//   Creep behavior (e.g., no upgrading room controller at CRITICAL)
//   Number of creeps of each type
//   Body size/configuration of creeps
//   Minimum level of repair for decayable things (storage, roads, ramparts)
//   Minimum level of repair of walls

// Resource budget is complex.
// 1. Income averages to 10 energy per tick per source
// 2. A creep lasts 1500 ticks,
//    a. takes 3 ticks per body part to build (CREEP_SPAWN_TIME)
//    b. takes a variable energy cost per body part (BODYPART_COST)
// 3. Number of structures differs at controller level (CONTROLLER_STRUCTURES, no arrays)
//


// Determines the number of containers that are adjacent to sources.
// NOTE: THIS MUST MATCH CALCULATIONS IN role.harvester2.determine_destination()!!!
function count_source_containers(room) {
    let room_sources = room.find(FIND_SOURCES);

    // Go through all sources and all nearby containers, and pick one that is not
    // claimed by another harvester2 for now.
    // TODO: Prefer to pick one at a source that isn't already claimed.
    let retval = 0;

    source_container_search:
    for (let source of room_sources) {
        let nearby_containers =
            source.pos.findInRange(FIND_STRUCTURES, 2, { filter: s => s.structureType == STRUCTURE_CONTAINER });
        // console.log(room.name + ', source: ' + source.id + ', nearby containers: ' + nearby_containers.length);
        for (let nc of nearby_containers) {
            if (nc.pos.getRangeTo(source) >= 2.0) {
                // We can't say 1.999 above I don't think, in the findInRange, so double check.
                continue;
            }
            retval++;
        } // nearby_containers
    } // room_sources

    return retval;
} // num_source_containers


// Summarizes the situation in a room in a single object.
// Room can be a string room name or an actual room object.
function summarize_room_internal(room) {
    if (_.isString(room)) {
        room = Game.rooms[room];
    }
    if (room === null) {
        return null;
    }
    if (room.controller === null || !room.controller.my) {
        // Can null even happen?
        return null;
    }
    const controller_level = room.controller.level;
    const controller_progress = room.controller.progress;
    const controller_needed = room.controller.progressTotal;
    const controller_downgrade = room.controller.ticksToDowngrade;
    const controller_blocked = room.controller.upgradeBlocked;
    const controller_safemode = room.controller.safeMode ? room.controller.safeMode : 0;
    const controller_safemode_avail = room.controller.safeModeAvailable;
    const controller_safemode_cooldown = room.controller.safeModeCooldown;
    const has_storage = room.storage !== null;
    const storage_energy = room.storage ? room.storage.store[RESOURCE_ENERGY] : 0;
    const storage_minerals = room.storage ? _.sum(room.storage.store) - storage_energy : 0;
    const energy_avail = room.energyAvailable;
    const energy_cap = room.energyCapacityAvailable;
    const containers = room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_CONTAINER });
    const num_containers = containers === null ? 0 : containers.length;
    const container_energy = _.sum(containers, c => c.store.energy);
    const sources = room.find(FIND_SOURCES);
    const num_sources = sources === null ? 0 : sources.length;
    const source_energy = _.sum(sources, s => s.energy);
    const links = room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_LINK && s.my });
    const num_links = links === null ? 0 : links.length;
    const link_energy = _.sum(links, l => l.energy);
    const minerals = room.find(FIND_MINERALS);
    const mineral = minerals && minerals.length > 0 ? minerals[0] : null;
    const mineral_type = mineral ? mineral.mineralType : "";
    const mineral_amount = mineral ? mineral.mineralAmount : 0;
    const extractors = room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_EXTRACTOR });
    const num_extractors = extractors.length;
    const creeps = _.filter(Game.creeps, c => c.pos.roomName == room.name && c.my);
    const num_creeps = creeps ? creeps.length : 0;
    const enemy_creeps = room.find(FIND_HOSTILE_CREEPS);
    const creep_energy = _.sum(Game.creeps, c => c.pos.roomName == room.name ? c.carry.energy : 0);
    const num_enemies = enemy_creeps ? enemy_creeps.length : 0;
    const spawns = room.find(FIND_MY_SPAWNS);
    const num_spawns = spawns ? spawns.length : 0;
    const spawns_spawning =  _.sum(spawns, s => s.spawning ? 1 : 0);
    const towers = room.find(FIND_STRUCTURES, { filter: s => s.structureType == STRUCTURE_TOWER && s.my });
    const num_towers = towers ? towers.length : 0;
    const tower_energy = _.sum(towers, t => t.energy);
    const const_sites = room.find(FIND_CONSTRUCTION_SITES);
    const my_const_sites = room.find(FIND_CONSTRUCTION_SITES, { filter: cs => cs.my });
    const num_construction_sites = const_sites.length;
    const num_my_construction_sites = my_const_sites.length;
    const num_source_containers = count_source_containers(room);
    const has_terminal = room.terminal !== null;
    const terminal_energy = room.terminal ? room.terminal.store[RESOURCE_ENERGY] : 0;
    const terminal_minerals = room.terminal ? _.sum(room.terminal.store) - terminal_energy : 0;

    // Get info on all our structures
    // TODO: Split roads to those on swamps vs those on dirt
    const structure_types = new Set(room.find(FIND_STRUCTURES).map(s => s.structureType));
    const structure_info = {};
    for (const s of structure_types) {
        const ss = room.find(FIND_STRUCTURES, {filter: str => str.structureType == s});
        structure_info[s] = {
            count: ss.length,
            min_hits: _.min(ss, 'hits').hits,
            max_hits: _.max(ss, 'hits').hits,
        };
    }
    // console.log(JSON.stringify(structure_info));

    const ground_resources = room.find(FIND_DROPPED_RESOURCES);
    // const ground_resources_short = ground_resources.map(r => ({ amount: r.amount, resourceType: r.resourceType }));
    const reduced_resources = _.reduce(ground_resources, (acc, res) => { acc[res.resourceType] = _.get(acc, [res.resourceType], 0) + res.amount; return acc; }, {});

    // _.reduce([{resourceType: 'energy', amount: 200},{resourceType: 'energy', amount:20}], (acc, res) => { acc[res.resourceType] = _.get(acc, [res.resourceType], 0) + res.amount; return acc; }, {});

    // console.log(JSON.stringify(reduced_resources));

    // Number of each kind of creeps
    // const creep_types = new Set(creeps.map(c => c.memory.role));
    const creep_counts = _.countBy(creeps, c => c.memory.role);

    // Other things we can count:
    // Tower count, energy
    // Minimum health of ramparts, walls
    // Minimum health of roads
    // Number of roads?
    // Resources (energy/minerals) on the ground?

    // Other things we can't count but we _can_ track manually:
    // Energy spent on repairs
    // Energy spent on making creeps
    // Energy lost to links
    //
    // Energy in a source when it resets (wasted/lost energy)

    let retval = {
        room_name: room.name, // In case this gets taken out of context
        controller_level,
        controller_progress,
        controller_needed,
        controller_downgrade,
        controller_blocked,
        controller_safemode,
        controller_safemode_avail,
        controller_safemode_cooldown,
        energy_avail,
        energy_cap,
        num_sources,
        source_energy,
        mineral_type,
        mineral_amount,
        num_extractors,
        has_storage,
        storage_energy,
        storage_minerals,
        has_terminal,
        terminal_energy,
        terminal_minerals,
        num_containers,
        container_energy,
        num_links,
        link_energy,
        num_creeps,
        creep_counts,
        creep_energy,
        num_enemies,
        num_spawns,
        spawns_spawning,
        num_towers,
        tower_energy,
        structure_info,
        num_construction_sites,
        num_my_construction_sites,
        ground_resources: reduced_resources,
        num_source_containers,
    };

    // console.log('Room ' + room.name + ': ' + JSON.stringify(retval));
    return retval;
} // summarize_room

function summarize_rooms() {
    const now = Game.time;

    // First check if we cached it
    if (global.summarized_room_timestamp == now) {
        return global.summarized_rooms;
    }

    let retval = {};

    for (let r in Game.rooms) {
        let summary = summarize_room_internal(Game.rooms[r]);
        retval[r] = summary;
    }

    global.summarized_room_timestamp = now;
    global.summarized_rooms = retval;

    // console.log('All rooms: ' + JSON.stringify(retval));
    return retval;
} // summarize_rooms

function summarize_room(room) {
    if (_.isString(room)) {
        room = Game.rooms[room];
    }
    if (room === null) {
        return null;
    }

    const sr = summarize_rooms();

    return sr[room.name];
}

// Module to format data in memory for use with the https://screepspl.us
// Grafana utility run by ags131.
//
// Installation: Run a node script from https://github.com/ScreepsPlus/node-agent
// and configure your screepspl.us token and Screeps login (if you use Steam,
// you have to create a password on the Profile page in Screeps),
// then run that in the background (e.g., on Linode, AWS, your always-on Mac).
//
// Then, put whatever you want in Memory.stats, which will be collected every
// 15 seconds (yes, not every tick) by the above script and sent to screepspl.us.
// In this case, I call the collect_stats() routine below at the end of every
// trip through the main loop, with the absolute final call at the end of the
// main loop to update the final CPU usage.
//
// Then, configure a Grafana page (see example code) which graphs stuff whichever
// way you like.
//
// This module uses my resources module, which analyzes the state of affairs
// for every room you can see.
global.stats_callbacks = new Callback();
// Tell us that you want a callback when we're collecting the stats.
// We will send you in the partially completed stats object.
function add_stats_callback(cbfunc) {
    global.stats_callbacks.subscribe(cbfunc);
}


// Update the Memory.stats with useful information for trend analysis and graphing.
// Also calls all registered stats callback functions before returning.
function collect_stats() {

    // Don't overwrite things if other modules are putting stuff into Memory.stats
    if (Memory.stats === null) {
        Memory.stats = { tick: Game.time };
    }

    // Note: This is fragile and will change if the Game.cpu API changes
    Memory.stats.cpu = Game.cpu;
    // Memory.stats.cpu.used = Game.cpu.getUsed(); // AT END OF MAIN LOOP

    // Note: This is fragile and will change if the Game.gcl API changes
    Memory.stats.gcl = Game.gcl;

    const memory_used = RawMemory.get().length;
    // console.log('Memory used: ' + memory_used);
    Memory.stats.memory = {
        used: memory_used,
        // Other memory stats here?
    };

    Memory.stats.market = {
        credits: Game.market.credits,
        num_orders: Game.market.orders ? Object.keys(Game.market.orders).length : 0,
    };

    Memory.stats.roomSummary = summarize_rooms();

    // Add callback functions which we can call to add additional
    // statistics to here, and have a way to register them.
    // 1. Merge in the current repair ratchets into the room summary
    // TODO: Merge in the current creep desired numbers into the room summary
    global.stats_callbacks.fire(Memory.stats);
    //console.log(JSON.stringify(global.stats_callbacks));
}

function act(creep) {
    switch (creep.memory.important) {
        case 'build':
            build(creep);
            break;
        case 'deposit':
            deposit(creep);
            break;
        case 'eat':
            eat(creep);
            break;
        case 'gather':
            gather(creep);
            break;
        case 'mine':
            mine(creep);
            break;
        case 'upgrade':
            upgrade(creep);
            break;
    }
}

function gatherAura(creep) {
        var shinies = creep.pos.findInRange(FIND_DROPPED_RESOURCES, 1, {
            filter: r => r.resourceType == RESOURCE_ENERGY
        });
        var moarshinies = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_CONTAINER
        });
        var evenmoarshinies = creep.pos.findInRange(FIND_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_STORAGE
        });
        if(creep.memory.role != 'newt' && creep.memory.role != 'toad'){
          if (creep.withdraw(evenmoarshinies[0], RESOURCE_ENERGY) === 0) {
              creep.say('shinies');
          }
        }
        if(creep.memory.role != 'toad'){
          if (creep.withdraw(moarshinies[0], RESOURCE_ENERGY) === 0) {
              creep.say('shinies');
          }
        }
        if (creep.pickup(shinies[0]) === 0) {
            creep.say('shinies');
        }
}

function depositAura(creep) {
        var nearExt = creep.pos.findInRange(FIND_MY_STRUCTURES, 1, {
            filter: s => s.structureType == STRUCTURE_EXTENSION
        });
        //console.log(nearExt);
        for(let e in nearExt){
          //console.log(nearExt[e]);
          if (creep.transfer(nearExt[e], RESOURCE_ENERGY) === 0) {
              creep.say('teehee');
          }
        }
}

function frog(creep) {
    if (!creep.memory.from) {
        const r = creep.room;
        let containerArray = r.containerIDs();
        let gatherArray = r.storageIDs();
        gatherArray = gatherArray.concat(containerArray);
        creep.memory.from = gatherArray;
    }
    //in rcl3 we want frogs to build and upgrade
    if (creep.carry.energy === 0) {
        creep.memory.important = 'gather';
    } else if (creep.carry.energy == creep.carryCapacity) {
        creep.memory.important = 'build';
    }
    act(creep);
    gatherAura(creep);
}

function newt(creep) {
    depositAura(creep);
    if (!creep.memory.to) {
        const r = creep.room;
        let extensionArray = r.extensionIDs();
        let spawnerArray = r.spawnerIDs();
        let towerArray = r.towerIDs();
        //let storageArray = r.storageIDs();
        let frogArray = r.roleIDs('frog');
        let depositArray = spawnerArray.concat(extensionArray);
        depositArray = depositArray.concat(towerArray);
        depositArray = depositArray.concat(frogArray);
        //depositArray = depositArray.concat(storageArray);
        creep.memory.to = depositArray;
    }
    if (!creep.memory.from) {
        const r = creep.room;
        let storageArray = r.storageIDs();
        let containerArray= r.containerIDs();
        let gatherArray = storageArray.concat(containerArray);
        creep.memory.from = [_.max(gatherArray, function(containerID) {
            return Game.getObjectById(containerID).store[RESOURCE_ENERGY];
        })];
    }
    //in rcl3 we want newts to haul from containers to spawn energy array and tower
    if (creep.carry.energy === 0) {
        creep.memory.important = 'gather';
    } else if (creep.carry.energy === creep.carryCapacity) {
        creep.memory.important = 'deposit';
    }
    act(creep);
    depositAura(creep);
    gatherAura(creep);
}

function redspawn(creep) {
  depositAura(creep);
    //before the extensions are built
    if (creep.room.extensionIDs().length < 5) {
        //if redspawn count is below threshold
        if (_(Memory.creeps).filter({
                role: 'redspawn'
            }, {
                room: creep.room.name
            }).size() < creep.memory.max) {
            if (!creep.memory.to) {
                const r = creep.room;
                let extensionArray = r.extensionIDs();
                //console.log(extensionArray);
                let spawnerArray = r.spawnerIDs();
                //console.log(spawnerArray);
                let depositArray = spawnerArray.concat(extensionArray);
                creep.memory.to = depositArray;
            }
            //we need to put energy in the spawn
            if (creep.carry.energy === 0) {
                creep.memory.important = 'mine';
            } else if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.important = 'deposit';
            }
        } else {
            //if redspawn count is equal to or above threshold build
            if (creep.carry.energy === 0) {
                creep.memory.important = 'mine';
            } else if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.important = 'build';
            }
        }
    }else{
      if(!creep.memory.reset){
        creep.memory.resetTo = true;
        creep.memory.to = null;
      }
      //if extension count is fulfilled
      //specify the creep deposit array
      if (!creep.memory.to) {
          const r = creep.room;
          let extensionArray = r.extensionIDs();
          //console.log(extensionArray);
          let spawnerArray = r.spawnerIDs();
          //console.log(spawnerArray);
          let depositArray = spawnerArray.concat(extensionArray);
          creep.memory.to = depositArray;
      }
      //if the spawn energy is at max
      if(creep.room.energyAvailable == creep.room.energyCapacityAvailable){
        if (creep.carry.energy === 0) {
            creep.memory.important = 'mine';
        } else if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.important = 'build';
        }
      }else{
        if (creep.carry.energy === 0) {
            creep.memory.important = 'mine';
        } else if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.important = 'deposit';
        }
      }

    }
    act(creep);
    gatherAura(creep);
}

function squatter(creep) {
    //var extend = reds(creep);
    var target = Game.flags['claim'];
    if (target) {
        creep.moveTo(target);
        if (creep.room === Game.flags['claim'].room) {
            if (creep.claimController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                creep.moveTo(creep.room.controller);
            }
        }
    } else {
        if(Game.getObjectById(creep.memory.home).recycleCreep(creep)==ERR_NOT_IN_RANGE){
          creep.moveTo(Game.getObjectById(creep.memory.home));
        }
    }
}

function spawnSquatter(){
  Game.spawns.Spawn1.createCreep([CLAIM, MOVE], Game.time + '_squatter');
}

function tadpole(creep) {
    //before the extensions are built
    if (creep.room.extensionIDs().length < 10) {
        //if tadpole count is below threshold
        if (_(Memory.creeps).filter({
                role: 'tadpole'
            }, {
                room: creep.room.name
            }).size() < creep.memory.max) {
            if (!creep.memory.to) {
                const r = creep.room;
                let extensionArray = r.extensionIDs();
                //console.log(extensionArray);
                let spawnerArray = r.spawnerIDs();
                //console.log(spawnerArray);
                let depositArray = spawnerArray.concat(extensionArray);
                creep.memory.to = depositArray;
            }
            //we need to put energy in the spawn
            if (creep.carry.energy === 0) {
                creep.memory.important = 'mine';
            } else if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.important = 'deposit';
            }
        } else {
            //if tadpole count is equal to or above threshold build
            if (creep.carry.energy === 0) {
                creep.memory.important = 'mine';
            } else if (creep.carry.energy === creep.carryCapacity) {
                creep.memory.important = 'build';
            }
        }
    }else{
      if(!creep.memory.reset){
        creep.memory.resetTo = true;
        creep.memory.to = null;
      }
      //if extension count is fulfilled
      //specify the creep deposit array
      if (!creep.memory.to) {
          const r = creep.room;
          let extensionArray = r.extensionIDs();
          //console.log(extensionArray);
          let spawnerArray = r.spawnerIDs();
          //console.log(spawnerArray);
          let depositArray = spawnerArray.concat(extensionArray);
          creep.memory.to = depositArray;
      }
      //if the spawn energy is at max
      if(creep.room.energyAvailable == creep.room.energyCapacityAvailable){
        if (creep.carry.energy === 0) {
            creep.memory.important = 'mine';
        } else if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.important = 'build';
        }
      }else{
        if (creep.carry.energy === 0) {
            creep.memory.important = 'mine';
        } else if (creep.carry.energy === creep.carryCapacity) {
            creep.memory.important = 'deposit';
        }
      }

    }
    act(creep);
    depositAura(creep);
    gatherAura(creep);
}

function toad(creep) {
  if(creep.carry[creep.resourceType] === 0){
    creep.memory.important = 'mine';
  }
  gatherAura(creep);
  //in rcl3 we want toads to mine sources and deposit to containers
  act(creep);
    if (!creep.memory.to) {
        var source = Game.getObjectById(creep.memory.mine);
        var container = source.pos.findClosestByRange(FIND_STRUCTURES, {filter : (c) => c.structureType == STRUCTURE_CONTAINER});
        if(container){
          creep.memory.to = [container.id];
        }
    }
}

function tower(structure) {
  var nearenemies = structure.pos.findInRange(FIND_HOSTILE_CREEPS, 15);
  if (!Memory.towers[structure.id]) {
      Memory.towers[structure.id] = {};
  }
  if (!Memory.towers[structure.id].mode) {
      Memory.towers[structure.id].mode = 'alert';
  }
	if(structure.energy <= 900 || nearenemies.length > 0){
	    Memory.towers[structure.id].mode = 'alert';
	}else if(structure.energy > 900){
	    Memory.towers[structure.id].mode = 'repair';
	}
  var mode = Memory.towers[structure.id].mode;
	if(mode == 'alert'){
	    var hurt = structure.room.find(FIND_MY_CREEPS, {filter: object => object.hits < object.hitsMax});
    	if(nearenemies.length > 0){
    	    if(nearenemies.length > 1){
    	        nearenemies.sort((a,b) => a.hits - b.hits);
    	    }
            structure.attack(nearenemies[0]);
        }else if(hurt.length > 0){
    	    if(hurt.length >1){
    	        hurt.sort((a,b) => a.hits - b.hits);
    	    }
            structure.heal(hurt[0]);
        }


	}else if(mode == 'repair'){
	    var damaged = structure.room.find(FIND_STRUCTURES, {filter: object => (object.hitsMax/2 > object.hits)&&(object.hits < 100000)});
        //console.log('Detecting damaged structures');
        if(damaged.length > 0){
          //console.log('Attempting to repair now');
    	    if(damaged.length >1){
    	        damaged.sort((a,b) => (a.hits - b.hits));
    	    }
          // console.log('check repair sort: ');
          //console.log(damaged);
          structure.repair(damaged[0]);
        }
	}else{
	    if(nearenemies.length > 0){
    	    if(nearenemies.length >1){
    	        nearenemies.sort((a,b) => a.hits - b.hits);
    	    }
            structure.attack(nearenemies[0]);
        }
	}
}

function eraseDead() {
    for (var i in Memory.creeps) {
        if (!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }

}
//first clear memory
eraseDead();
//then trigger creep behavior
for (let name in Game.creeps) {
    var creep = Game.creeps[name];
    if (creep.memory.role == 'redspawn') {
        redspawn(creep);
    } else
    if (creep.memory.role == 'tadpole') {
        tadpole(creep);
    } else
    if (creep.memory.role == 'frog') {
        frog(creep);
    } else
    if (creep.memory.role == 'toad') {
        toad(creep);
    } else
    if (creep.memory.role == 'newt') {
        newt(creep);
    }
    if (creep.memory.role == 'squatter') {
        squatter(creep);
    }
}
//then trigger spawn behavior
for (let name in Game.spawns) {
  var spawn = Game.spawns[name];
  if(spawn.memory.queen){
    spawner(spawn);
  }
}
//then trigger towers
if (!Memory.towers){
  Memory.towers = {};
}
for (let towerID in Memory.towers) {
    tower(Game.getObjectById(towerID));
}
//then trigger links

//graphs
collect_stats();

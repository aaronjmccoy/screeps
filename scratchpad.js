'use strict';

StructureExtension.prototype.report = function() {
  if (this.my) {
    //if I control the extension
    if (this.energy < this.energyCapacity) {
      Memory.rooms[this.room.name].newt.deposit.push(this.id);
      Memory.rooms[this.room.name].toad.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].tower.fix.push(this.id);
      Memory.rooms[this.room.name].frog.fix.push(this.id);
    }
  } else {
    //if I do not control the extension
    if (this.energy > 0) {
      Memory.rooms[this.room.name].newt.collect.push(this.id);
      Memory.rooms[this.room.name].frog.collect.push(this.id);
    } else {
      Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
    }
  }
};

StructureLab.prototype.report = function() {
  if (this.room.controller.my) {
    //if I control the lab
    if (this.energy < this.energyCapacity) {
      Memory.rooms[this.room.name].newt.deposit.push(this.id);
    }
    //lab logic here later
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].frog.fix.push(this.id);
      Memory.rooms[this.room.name].tower.fix.push(this.id);
    }
  } else {
    //if I do not control the lab
    if (this.energy > 0) {
      Memory.rooms[this.room.name].newt.collect.push(this.id);
    } else {
      Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
    }
  }
};

StructurePowerSpawn.prototype.report = function() {
  if (this.room.controller.my) {
    //if I control the powerspawn
    if (this.energy < this.energyCapacity) {
      Memory.rooms[this.room.name].newt.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].tower.fix.push(this.id);
      Memory.rooms[this.room.name].frog.fix.push(this.id);
    }
  } else {
    //if I do not control the powerspawn
    if (this.energy > 0) {
      Memory.rooms[this.room.name].newt.collect.push(this.id);
    } else {
      Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
    }
  }
};

StructureRampart.prototype.report = function() {
  if (this.my) {
    //if I control the rampart
    if (this.hits < this.room.controller.level * 10000) {
      Memory.rooms[this.room.name].tower.fix.push(this.id);
      //Memory.rooms[this.room.name].frog.fix.push(this.id);
    }
    //auto-close when guarded
    if ([].concat(_toConsumableArray(this.room.lookAt(this.pos.x, this.pos.y))).length > 2) {
      this.setPublic(false);
    } else {
      this.setPublic(true);
    }
    //defensive close
    if (Memory.rooms[this.room.name].tower.whack.length > 0) {
      for (var e in Memory.rooms[this.room.name].tower.whack) {
        var enemy = Game.getObjectById(Memory.rooms[this.room.name].tower.whack[e]);
        if (this.pos.inRangeTo(enemy, 1)) {
          this.setPublic(false);
          return true;
        }
      }
    }
  } else {
    //if I do not control the rampart
    Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
    Memory.rooms[this.room.name].shark.whack.push(this.id);
  }
};

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

StructureRoad.prototype.report = function() {
  if (this.hits < 4000) {
    Memory.rooms[this.room.name].frog.fix.push(this.id);
    Memory.rooms[this.room.name].toad.fix.push(this.id);
    Memory.rooms[this.room.name].tower.fix.push(this.id);
  }
};

Source.prototype.report = function() {
  this.room.memory.toad.mine.push(this.id);
};

StructureSpawn.prototype.report = function() {
  if (this.room.controller.my && this.my) {
    //if I control the spawn
    //make sure everyone can eat
    Memory.rooms[this.room.name].frog.eat.push(this.id);
    Memory.rooms[this.room.name].toad.eat.push(this.id);
    Memory.rooms[this.room.name].newt.eat.push(this.id);
    Memory.rooms[this.room.name].shark.eat.push(this.id);

    if (this.energy < this.energyCapacity) {
      Memory.rooms[this.room.name].newt.deposit.push(this.id);
      Memory.rooms[this.room.name].toad.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].tower.fix.push(this.id);
      Memory.rooms[this.room.name].frog.fix.push(this.id);
    }
  } else {
    //if I do not control the spawn
    if (this.energy > 0) {
      Memory.rooms[this.room.name].newt.collect.push(this.id);
      Memory.rooms[this.room.name].toad.collect.push(this.id);

    }
    Memory.rooms[this.room.name].toad.deconstruct.push(this.id);
    Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
    Memory.rooms[this.room.name].shark.whack.push(this.id);
  }
};

StructureSpawn.prototype.spawnCreep = function(creepRecipe, rcl) {
  //We make sure to give the creep memory of it's home room for census purposes
  creepRecipe.options.room = this.room.name;
  //console.log('SPAWN HAS CHILD FOR DEFAULT: '+Memory.rooms[this.room.name].childRoom);
  if (creepRecipe.options.role == 'squatter' && Memory.rooms[this.room.name].children) {
    //console.log('setting default squat target to '+Memory.rooms[this.room.name].childRoom+' for creep in '+this.room.name);
    //creepRecipe.options.squatTarget = Memory.rooms[this.room.name].children[0];
  }
  switch (this.createCreep(creepRecipe.parts[rcl], creepRecipe.options.role + "_" + Game.time + "_" + this.room.name, creepRecipe.options)) {
    case - 10:
      //invalid body
      console.log('Body part array not properly formed for '+creepRecipe.options.role+': ');
      console.log(rcl+'::'+JSON.stringify(creepRecipe.parts[rcl]));
      break;
    case - 14:
      //rcl dropped
      console.log('RCL no longer sufficient to use this spawn');
  }
};

StructureStorage.prototype.report = function() {
  if (this.room.controller.my) {
    //if I control the storage
    if (this.store.energy >= 50) {
     var pushes = Math.min(Math.ceil(this.store.energy/1000), 8) ;
     for(var iStore = 0; iStore < pushes;iStore++){
        Memory.rooms[this.room.name].newt.collect.push(this.id);
        Memory.rooms[this.room.name].frog.collect.push(this.id);
     }
    }
    if (_.sum(this.store) < this.storeCapacity) {
      Memory.rooms[this.room.name].toad.deposit.push(this.id);
      Memory.rooms[this.room.name].minnow.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].frog.fix.push(this.id);
      Memory.rooms[this.room.name].toad.fix.push(this.id);
      Memory.rooms[this.room.name].tower.fix.push(this.id);
    }
  } else {
    //if I do not control the storage
    if (this.energy > 0) {
      Memory.rooms[this.room.name].newt.collect.push(this.id);
    } else {
      Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
    }
  }
};

StructureTerminal.prototype.report = function() {
  if (this.room.controller.my) {
    //if I control the storage
     var roomMaxed = this.room.energyAvailable == this.room.energyCapacityAvailable
    ? 1
    : 0;
    if (this.store.energy >= 0 && !roomMaxed) {
      Memory.rooms[this.room.name].newt.collect.push(this.id);
      Memory.rooms[this.room.name].frog.collect.push(this.id);
    }
    if (this.store.energy < this.storeCapacity) {
      Memory.rooms[this.room.name].toad.deposit.push(this.id);
      if(roomMaxed){
       Memory.rooms[this.room.name].newt.deposit.push(this.id);
      }
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].frog.fix.push(this.id);
      Memory.rooms[this.room.name].toad.fix.push(this.id);
      Memory.rooms[this.room.name].tower.fix.push(this.id);
    }
  } else {
    //if I do not control the storage
    if (this.energy > 0) {
      Memory.rooms[this.room.name].newt.collect.push(this.id);
    } else {
      Memory.rooms[this.room.name].frog.deconstruct.push(this.id);
    }
  }
};

StructureTower.prototype.report = function() {
    this.room.visual.circle(this.pos,
    {fill: 'transparent', radius: 5, stroke: 'red'});
  if (this.room.controller.my) {
    if (this.energy < this.energyCapacity) {
      Memory.rooms[this.room.name].newt.deposit.push(this.id);
      Memory.rooms[this.room.name].toad.deposit.push(this.id);
    }
    if (this.hits < this.hitsMax) {
      Memory.rooms[this.room.name].frog.fix.push(this.id);
      Memory.rooms[this.room.name].tower.fix.push(this.id);
    }
  } else {
    if (this.energy > 0) {

      Memory.rooms[this.room.name].newt.collect.push(this.id);

    } else {

      Memory.rooms[this.room.name].frog.deconstruct.push(this.id);

    }
  }
};

StructureWall.prototype.report = function() {
  if (this.hits < 1000 * this.room.controller.level) {
    Memory.rooms[this.room.name].tower.fix.push(this.id);
    Memory.rooms[this.room.name].frog.fix.push(this.id);
  }
};

/* jshint -W008 */
//// HEAL PLUS
Creep.prototype.aid = function() {
  if (this.memory.tasks.aid) {
    switch (this.heal(Game.getObjectById(this.memory.tasks.aid))) {
      case 0:
        return Memory.emoji.aid;
      case - 9:
        //set move
        
        this.moveTo(Game.getObjectById(this.memory.tasks.aid), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffaaaa',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
  }
  return Memory.emoji.oops + Memory.emoji.aid + Memory.emoji.oops;
};

/* jshint -W008 */
/// WITHDRAW PLUS /
Creep.prototype.collect = function() {
  if (this.memory.tasks.collect) {
    switch (this.withdraw(Game.getObjectById(this.memory.tasks.collect), this.memory.resourceType)) {
      case 0:
        return Memory.emoji.collect;
      case - 9:
        if (!this.collectAura()) {
          //set move
          
          this.moveTo(Game.getObjectById(this.memory.tasks.collect), {
            reusePath: 10,
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#eeff99',
              lineStyle: 'dashed',
              strokeWidth: .15,
              opacity: .1
            },
            
          });
          return Memory.emoji.hop;
        } else {
          return Memory.emoji.sogood;
        }
    }
  }
  return Memory.emoji.oops + Memory.emoji.collect + Memory.emoji.oops;
};

/* jshint -W008 */
//// BUILD PLUS
Creep.prototype.construct = function() {
  if (this.memory.tasks.construct) {
    
    this.moveTo(Game.getObjectById(this.memory.tasks.construct), {
      visualizePathStyle: {
        fill: 'transparent',
        stroke: '#aacc66',
        lineStyle: 'solid',
        strokeWidth: .15,
        opacity: .1
      }
    });
    switch (this.build(Game.getObjectById(this.memory.tasks.construct))) {
      case 0:
        return Memory.emoji.construct;
      case - 9:
        if (!this.constructAura()) {
          //set move
          return Memory.emoji.hop;
        } else {
          return Memory.emoji.sogood;
        }

    }
  }
  return Memory.emoji.oops + Memory.emoji.construct + Memory.emoji.oops;
};

/* jshint -W008 */
//// DISMANTLE PLUS
Creep.prototype.deconstruct = function() {
  if (this.memory.tasks.deconstruct) {
    switch (this.dismantle(Game.getObjectById(this.memory.tasks.deconstruct))) {
      case 0:
        return Memory.emoji.deconstruct;
      case - 9:
        if (!this.deconstructAura()) {
          //set move
          
          this.moveTo(Game.getObjectById(this.memory.tasks.deconstruct), {
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#ff0000',
              lineStyle: 'solid',
              strokeWidth: .15,
              opacity: .4
            }
          });
          return Memory.emoji.hop;
        } else {
          return Memory.emoji.sogood;
        }

    }
  }
  return Memory.emoji.oops + Memory.emoji.deconstruct + Memory.emoji.oops;
};

/* jshint -W008 */
//// DEFEND
Creep.prototype.defend = function() {
  

    this.moveTo(Game.getObjectById(this.memory.tasks.defend), {
      visualizePathStyle: {
        fill: 'transparent',
        stroke: '#ff0000',
        lineStyle: 'solid',
        strokeWidth: .15,
        opacity: .4
      }
    });


  return Memory.emoji.oops;
};

/* jshint -W008 */
/// TRANSFER PLUS /
Creep.prototype.deposit = function() {
  if (this.memory.tasks.deposit) {
    switch (this.transfer(Game.getObjectById(this.memory.tasks.deposit), RESOURCE_ENERGY)) {
      case 0:
        return Memory.emoji.deposit;
      case - 9:
        this.depositAura();
        //set move
        
        this.moveTo(Game.getObjectById(this.memory.tasks.deposit), {
          reusePath: 5,
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#eecc00',
            lineStyle: 'dashed',
            strokeWidth: .15,
            opacity: .1
          },
          
        });
        return Memory.emoji.frog;
    }
  }
  this.moveTo(this.room.storage, {
    reusePath: 5,
    ignoreCreeps: false,
    visualizePathStyle: {
      fill: 'transparent',
      stroke: '#eecc00',
      lineStyle: 'dashed',
      strokeWidth: .15,
      opacity: .1
    },
    
  });
  return Memory.emoji.sogood;
};

/* jshint -W008 */
//// RENEWCREEP PLUS
Creep.prototype.eat = function() {
  this.depositAura();
  //any creep checking to eat with less hp thean 1000 should eat then
  if (this.ticksToLive < 1000 && this.role !== 'squatter') {
    this.memory.hungry = true;
  }
  if (this.memory.tasks.eat) {
    if (Game.getObjectById(this.memory.tasks.eat).renewCreep(this) === 0) {
      return Memory.emoji.eat;
    } else {
      //if hungry eat
      if (this.memory.hungry) {
        //set move
        
        this.moveTo(Game.getObjectById(this.memory.tasks.eat), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#00eeff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
        //if not go back to a starting point
      } else {
        if (this.memory.role == 'toad') {
          this.moveTo(Game.getObjectById(this.memory.tasks.mine), {
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#eeff99',
              lineStyle: 'solid',
              strokeWidth: .15,
              opacity: .1
            }
          });
          return Memory.emoji.hop;
        } else {
          this.moveTo(Game.rooms[this.memory.room].storage);
          return Memory.emoji.hop;
        }
      }
    }
    return this.moveTo(Game.getObjectById(this.memory.tasks.eat), {
      visualizePathStyle: {
        fill: 'transparent',
        stroke: '#00eeff',
        lineStyle: 'solid',
        strokeWidth: .15,
        opacity: .1
      }
    });
  }
};

/* jshint -W008 */
//// REPAIR PLUS
Creep.prototype.fix = function() {
  if (this.memory.tasks.fix) {
    switch (this.repair(Game.getObjectById(this.memory.tasks.fix))) {
      case 0:
        return Memory.emoji.fix;
      case - 9:
        if (!this.fixAura()) {
          //set move
          
          this.moveTo(Game.getObjectById(this.memory.tasks.fix), {
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#ffaaaa',
              lineStyle: 'solid',
              strokeWidth: .15,
              opacity: .5
            }
          });
          return Memory.emoji.fix;
        }
        return Memory.emoji.sogood;
    }
  }
  return Memory.emoji.oops + Memory.emoji.fix + Memory.emoji.oops;
};

/* jshint -W008 */
//// HARVEST PLUS
Creep.prototype.mine = function() {
  if (this.memory.tasks.mine) {
    switch (this.harvest(Game.getObjectById(this.memory.tasks.mine))) {
      case 0:
        var look = this.pos.look();
        var resourceCount = 0;
        look.forEach(function(lookObject) {
          if (lookObject.type == LOOK_RESOURCES) {
            resourceCount += 1;
          }
        });
        if (resourceCount > 0) {
          this.moveTo(Game.getObjectById(this.memory.tasks.mine));
        }
        return Memory.emoji.mine;
      case - 9:
        //set move
        
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
      case - 6:
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

/* jshint -W008 */
//// RESERVE PLUS
Creep.prototype.squat = function() {
    //console.log('Attempting to squat lock to '+Memory.rooms[this.memory.room].children[1]);
    //this.memory.squatTarget = (Memory.rooms[this.memory.room].children[1]);
    //console.log('manual squat: '+this.memory.room+' : '+this.memory.squatTarget)
  if (this.memory.tasks.squat) {
      this.memory.squatTarget = Game.getObjectById(this.memory.tasks.squat).pos.roomName;
    if (this.reserveController(Game.getObjectById(this.memory.tasks.squat)) == 0) {
        this.memory.squatLock = this.memory.tasks.squat;
        this.signController(Game.getObjectById(this.memory.tasks.squat), "Ribbit");
      return Memory.emoji.frog;
    } else {
      //set move
      //console.log(JSON.stringify(Memory.rooms[this.memory.squatTarget].controller.pos));
      
      if (this.memory.squatTarget) {
        // console.log(this.name);
        // console.log(this.memory.squatTarget);
        // console.log(Memory.rooms[this.memory.squatTarget]);
        this.moveTo(new RoomPosition(Memory.rooms[this.memory.squatTarget].controller.pos.x, Memory.rooms[this.memory.squatTarget].controller.pos.y, this.memory.squatTarget), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffafaf',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .5
          }
        });
      } else {
        //console.log(Memory.rooms[Memory.rooms[this.memory.room].children[0]].squatter.squat);
        //console.log(Memory.rooms[Memory.rooms[this.memory.room].children[0]].squatter.squat.includes(this.memory.tasks.squat));
        this.memory.squatTarget = (Memory.rooms[Memory.rooms[this.memory.room].children[0]].squatter.squat.includes(this.memory.tasks.squat) ? Memory.rooms[this.memory.room].children[0] : Memory.rooms[this.memory.room].children[1]) ;
        //console.log('set target for squat after fail: '+ this.memory.squatTarget +' for creep whose home is room '+this.memory.room);
      }
      return Memory.emoji.sogood;
    }
  }
  return false;
};

/* jshint -W008 */
/// PICKUP PLUS /
Creep.prototype.sweep = function() {
  if (Game.getObjectById(this.memory.tasks.sweep).resourceType == 'energy') {
    switch (this.pickup(Game.getObjectById(this.memory.tasks.sweep))) {
      case 0:
        return Memory.emoji.sweep;
      case - 9:
        if (!this.sweepAura()) {
          //set move
          
          this.moveTo(Game.getObjectById(this.memory.tasks.sweep), {
            reusePath: 10,
            visualizePathStyle: {
              fill: 'transparent',
              stroke: '#eecc00',
              lineStyle: 'dashed',
              strokeWidth: .15,
              opacity: .1
            },
            
          });
          return Memory.emoji.hop;
        } else {
          return Memory.emoji.sogood;
        }

    }
  }
  return Memory.emoji.oops + Memory.emoji.sweep + Memory.emoji.oops;
};

/* jshint -W008 */
//// UPGRADECONTROLLER PLUS
Creep.prototype.upgrade = function() {
  if (this.memory.tasks.upgrade) {
    switch (this.upgradeController(Game.getObjectById(this.memory.tasks.upgrade))) {
      case 0:
        //CM.set(this.pos.x, this.pos.y, 255);
        //this.move(Math.random() * (8 - 1) + 1);
        //no need to clear memory for upgrade, controller is permanent
        return Memory.emoji.upgrade;
      case - 9:
        //set move
        
        this.moveTo(Game.getObjectById(this.memory.tasks.upgrade), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffffff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
  }
  return Memory.emoji.oops + Memory.emoji.upgrade + Memory.emoji.oops;
};

/* jshint -W008 */
//// ATTACK PLUS
Creep.prototype.whack = function() {
  if (this.memory.tasks.whack) {
    switch (this.rangedAttack(Game.getObjectById(this.memory.tasks.whack))) {
      case 0:
        //CM.set(this.pos.x, this.pos.y, 255);
        //this.move(Math.random() * (8 - 1) + 1);
        //no need to clear memory for upgrade, controller is permanent
        return Memory.emoji.upgrade;
      case - 9:
        //set move
        
        this.moveTo(Game.getObjectById(this.memory.tasks.whack), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffffff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
    switch (this.attack(Game.getObjectById(this.memory.tasks.whack))) {
      case 0:
        //CM.set(this.pos.x, this.pos.y, 255);
        //this.move(Math.random() * (8 - 1) + 1);
        //no need to clear memory for upgrade, controller is permanent
        return Memory.emoji.upgrade;
      case - 9:
        //set move
        
        this.moveTo(Game.getObjectById(this.memory.tasks.whack), {
          visualizePathStyle: {
            fill: 'transparent',
            stroke: '#ffffff',
            lineStyle: 'solid',
            strokeWidth: .15,
            opacity: .1
          }
        });
        return Memory.emoji.hop;
    }
    return Memory.emoji.whack;
    }
  return Memory.emoji.oops + Memory.emoji.whack + Memory.emoji.oops;
};

Creep.prototype.claimer = function() {
  //move to claim target and claim
  this.moveTo(new RoomPosition(19, 15, 'E3S8'));
  this.claimController(this.room.controller);
  this.signController(this.room.controller, "Ribbit");
};

//// TASK ASSIGNMENT
//get current assignment with Room.releaseTask
Creep.prototype.requestTask = function(task) {
  //console.log(this.name+' requesting '+task+' task')
  //if you don't have this task in memory yet make a prop for it
  if (!this.memory.tasks) {
    this.memory.tasks = {};
  }
  //request a task from the Room object you are working for
  this.memory.tasks[task] = Game.rooms[this.memory.room].releaseTask(this.memory.role, task);
  //if(task=='squat'){
  //console.log('AFTER RELEASE: '+this.memory.tasks[task]);
  //}
  //if it didn't return null
  if (this.memory.tasks[task]) {
    //push the task back to the array for reasons explained in _room.js
    Game.rooms[this.memory.room].memory[this.memory.role][task].push(this.memory.tasks[task]);
    return this.memory.tasks[task];
  } else {
    this.memory.tasks[task] = null;
    return false;
  }
};

Creep.prototype.requestLocalTask = function(task) {
  //console.log(this.name+' requesting '+task+' task')
  //if you don't have this task in memory yet make a prop for it
  if (!this.memory.tasks) {
    this.memory.tasks = {};
  }
  //request a task from the Room object you are working for
  this.memory.tasks[task] = this.room.releaseTask(this.memory.role, task);
  //if(task=='squat'){
  //console.log('AFTER RELEASE: '+this.memory.tasks[task]);
  //}
  //if it didn't return null
  if (this.memory.tasks[task]) {
    //push the task back to the array for reasons explained in _room.js
    this.room.memory[this.memory.role][task].push(this.memory.tasks[task]);
    return this.memory.tasks[task];
  } else {
    this.memory.tasks[task] = null;
    return false;
  }
};

//aura utilities for preliminary actions pre-movement
/* I don't know if I like these or not. The principle is that they rely on the
arrays of data to be so well organized and granular that even when iterating
through the entire data set to deposit before moving first, that cost will be
negligible. Since they return the second they find a compatible target it seems
as good a method as any if the goal is to prevent uneccessary movement. It also
enables us to focus on saving cpu when pathfinding over task completion, since
task completion is array fast. Still, I think there is a more elegant approach. */
Creep.prototype.aidAura = function() {
  //Two for-loops look gnarly, but this allows us to sort by distance at the same
  //time it is still array fast.
  for (var wounded in Memory.rooms[this.memory.room][this.memory.role].aid) {
    if (this.heal(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].aid[wounded])) === 0) {
      return true;
    }
  }
  for (var _wounded in Memory.rooms[this.memory.room][this.memory.role].aid) {
    if (this.rangedHeal(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].aid[_wounded])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.collectAura = function() {
  for (var loot in Memory.rooms[this.memory.room][this.memory.role].collect) {
    if (this.withdraw(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].collect[loot]), this.memory.resourceType) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.constructAura = function() {
  for (var site in Memory.rooms[this.memory.room][this.memory.role].construct) {
    if (this.build(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].construct[site])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.deconstructAura = function() {
  for (var debris in Memory.rooms[this.memory.room][this.memory.role].deconstruct) {
    if (this.dismantle(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].deconstruct[debris])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.depositAura = function() {
  for (var bank in Memory.rooms[this.memory.room][this.memory.role].deposit) {
    if (this.transfer(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].deposit[bank]), this.memory.resourceType) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.eatAura = function() {
  this.depositAura();
  for (var dinner in Memory.rooms[this.memory.room][this.memory.role].eat) {
    if (Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].eat[dinner]).renewCreep(this) === 0) {
        this.moveTo(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].eat[dinner]));
      return true;
    }
  }
  return false;
};

Creep.prototype.fixAura = function() {
  for (var broken in Memory.rooms[this.memory.room][this.memory.role].fix) {
    if (this.repair(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].fix[broken])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.mineAura = function() {
  for (var _source in Memory.rooms[this.memory.room][this.memory.role].mine) {
    if (this.harvest(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].mine[_source])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.sweepAura = function() {
  for (var mote in Memory.rooms[this.memory.room][this.memory.role].sweep) {
    if (this.pickup(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].sweep[mote])) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.upgradeAura = function() {
  for (var controller in Memory.rooms[this.memory.room][this.memory.role].upgrade) {
    if (this.upgradeController(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].upgrade[controller]), RESOURCE_ENERGY) === 0) {
      return true;
    }
  }
  return false;
};

Creep.prototype.whackAura = function() {
  for (var enemy in Memory.rooms[this.pos.roomName][this.memory.role].whack) {
    if (this.attack(Game.getObjectById(Memory.rooms[this.pos.roomName][this.memory.role].whack[enemy])) === 0) {
      console.log('whacked');
    }
    if (this.rangedAttack(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].whack[enemy])) === 0) {
      console.log('zapped');
    }else{
        this.rangedMassAttack(Game.getObjectById(Memory.rooms[this.memory.room][this.memory.role].whack[enemy]));
        console.log('boomed');
        return false;
    }
  }
  return false;
};

Creep.prototype.frog = function() {
  //state flipper
  if (_.sum(this.carry) === 0) {
    this.memory.state = 0;
  }
  //why do I want them to sit still until they are full? possible energy drains?
  if (_.sum(this.carry) === this.carryCapacity) {
    this.memory.state = 1;
  }
  //attempt all non-exclusive action auras
  this.sweepAura();
  this.collectAura();
  this.fixAura();
  this.deconstructAura();
  this.constructAura();
  //if hungry eat
  if (this.memory.hungry) {
    if (this.requestTask('eat')) {
      this.moveTo(Game.getObjectById(this.memory.tasks.eat));
      this.eatAura();
      return Memory.emoji.hop;
    } else if(this.requestTask('eat')){
      this.moveTo(Game.getObjectById(this.memory.tasks.eat));
      this.eatAura();
      return Memory.emoji.hop;
    }
  }
  //if this has energy
  if (this.memory.state) {
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('fix')) {
      return this.fix();
    } else if (this.requestTask('construct')) {
      return this.construct();
    } else if (this.requestTask('upgrade')) {
      this.mineAura();
      return this.upgrade();
    } else if (this.requestTask('deconstruct')) {
      return this.deconstruct();
    } else if (this.requestTask('eat')) {
      return this.eat();
    } else {
      return 'zzz'; //if this has no energy;
    }
  } else {
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('collect')) {
      return this.collect();
    } else if (this.requestTask('sweep')) {
      return this.sweep();
    } else if (this.requestTask('mine')) {
      return this.mine();
    } else if (this.requestTask('deconstruct')) {
      return this.deconstruct();
    } else if (this.requestTask('collect')) {
      return this.collect();
    } else{
        return 'zzz';
    }
  }
};

Creep.prototype.minnow = function() {
  //state flipper
  if (_.sum(this.carry) === 0) {
    this.memory.state = //if creep has energy
    0;
  } else if (this.carry.energy > 0) {
    this.memory.state = 1;
  }

  if (!this.memory.from) {
    this.sweepAura();
    this.collectAura();
  }

  if (!this.memory.to) {
    if (this.depositAura()) {
      return Memory.emoji.sogood;
    }
  }
  //if this has energy
  if (this.memory.state) {
    if (this.memory.to) {
      for (var resourceType in this.carry) {
        if (this.transfer(Game.getObjectById(this.memory.to), resourceType) === 0) {
          return 'bibiibiii!';
        }
      }
      if (this.moveTo(Game.getObjectById(this.memory.to)) === 0) {
        return Memory.emoji.frog;
      }
    } else if (this.requestTask('deposit')) {
      return this.deposit();
    } else if (this.requestTask('eat')) {
      return this.eat();
      //if this has no energy;
    }
  } else {
    if (this.memory.from) {
      for (var _resourceType in RESOURCES_ALL) {
        if (this.withdraw(Game.getObjectById(this.memory.from), RESOURCES_ALL[_resourceType]) === 0) {
          return 'bibiibiii!';
        }
      }
      if (this.moveTo(Game.getObjectById(this.memory.from)) === 0) {
        return Memory.emoji.frog;
      }
    } else {
      //primary tasks in order of importance inside of state logic
      //console.log(this.moveTo(new RoomPosition(23, 48, 'E6S9')));
    }
  }
  return 'zzz';
};

Creep.prototype.newt = function() {
  //state flipper
  this.eatAura();
  if (_.sum(this.carry) === 0) {
    this.memory.state = //if creep has energy
    0;
  } else if (this.carry.energy >= this.carryCapacity*.75) {
    this.memory.state = 1;
  }

  if (!this.memory.from) {
    //this.memory.from = null;
    this.sweepAura();
    this.collectAura();
  }

  if (!this.memory.to) {
    //this.memory.to = null;
    if (this.depositAura()) {
      return Memory.emoji.sogood;
    }
  }
  //if this has energy
  if (this.memory.state) {
    if (this.memory.to) {
      for (var resourceType in this.carry) {
        if (this.transfer(Game.getObjectById(this.memory.to), resourceType) === 0) {
          return 'bibiibiii!';
        }
      }
      if (this.moveTo(Game.getObjectById(this.memory.to)) === 0) {
        return Memory.emoji.frog;
      }
    } else if (this.requestTask('deposit')) {
      //this.memory.to = null;
      return this.deposit();
    } else if (this.requestTask('eat')) {
      return this.eat();

    }
    //if this has no energy;
  } else {
    if (this.memory.from) {
      for (var _resourceType2 in RESOURCES_ALL) {
        if (this.withdraw(Game.getObjectById(this.memory.from), RESOURCES_ALL[_resourceType2]) === 0) {
          return 'bibiibiii!';
        }
      }
      if (this.moveTo(Game.getObjectById(this.memory.from)) === 0) {
        return Memory.emoji.frog;
      }
    } else
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('sweep')) {
      //this.memory.from = null;
      return this.sweep();
    } else if (this.requestTask('collect')) {
      return this.collect();
    } else if (this.requestTask('eat')) {
      return this.eat();
    }
  }
  return 'zzz';
};

function queen(spawn) {
  var r = spawn.room;
  var rcl = r.controller.level;
  //load recipes for creep
  var frog = Memory.recipes.frog;
  var toad = Memory.recipes.toad;
  var newt = Memory.recipes.newt;
  var minnow = Memory.recipes.minnow;
  var claimer = Memory.recipes.claimer;
  var squatter = Memory.recipes.squatter;
  var shark = Memory.recipes.shark;
  //set population caps
  var childrenCount = (r.memory.children?r.memory.children.length:0);
  var newtCap = Math.min(r.memory.newt.collect.length, 15);
  var frogCap = 1+(childrenCount*2);
  var toadCap =  r.memory.toad.mine.length;
  var minnowCap = 0;
  var claimCap = 0;
  var sharkCap = Math.ceil(r.memory.shark.defend.length/2);
  var squatCap = r.memory.squatter.squat.length;
  var toads = r.roleCount('toad');
  //console.log(spawn.room.name + ' toads: ' + toads + ' toadcap: ' + toadCap);
  var frogs = r.roleCount('frog');
  //console.log(spawn.room.name + ' frogs: ' + frogs + ' frogcap: ' + frogCap);
  var newts = r.roleCount('newt');
  //console.log(spawn.room.name+' newts: '+newts+' newtCap: '+newtCap);
  var minnows = r.roleCount('minnow');
  //console.log(spawn.room.name + ' minnows: ' + minnows + ' minnowCap: ' + minnowCap);
  var claimers = r.roleCount('claimer');
  //console.log(spawn.room.name + ' minnows: ' + minnows + ' minnowCap: ' + minnowCap);
  var squatters = r.roleCount('squatter');
  //console.log(spawn.room.name + ' squatters: ' + squatters + ' squatCap: ' + squatCap);
  var sharks = r.roleCount('shark');
  //console.log(spawn.room.name + ' minnows: ' + minnows + ' minnowCap: ' + minnowCap);
  if (toads < toadCap) {
    for (var _i2 = 0; _i2 < rcl; _i2++) {
      spawn.spawnCreep(toad, Math.min(rcl+1 - _i2, 5));
    }
  } else if (newts < newtCap) {
    for (var _i3 = 0; _i3 < rcl; _i3++) {
        spawn.spawnCreep(newt, Math.min(rcl - _i3 + 1, 8));
    }
  } else if (frogs < frogCap) {
    for (var _i4 = 0; _i4 < rcl; _i4++) {
      spawn.spawnCreep(frog, rcl - _i4 + 1);
    }
  } else if (minnows < minnowCap) {
    spawn.spawnCreep(minnow, 2);
  } else if (claimers < claimCap) {
    spawn.spawnCreep(claimer, 1);
  } else if (sharks < sharkCap && (r.energyAvailable == r.energyCapacityAvailable)) {
    spawn.spawnCreep(shark, rcl);
  } else if (squatters < squatCap) {
    spawn.spawnCreep(squatter, rcl);
  }
}

//warfare unit
Creep.prototype.shark = function() {
  //if this has hp
  //this.whackAura();
  if(this.hits < this.hitsMax){
      this.heal(this);
  }else{
      this.aidAura()
  }
  if(this.memory.hungry){
    if (this.requestTask('eat')) {
        return this.eat();
    }
  }
      //console.log(this.name+'::STARTING');
     if (this.requestTask('whack')) {
        return this.whack();
     }
     if (this.requestTask('defend')) {
        return this.defend();
     }
     if (this.requestTask('aid')) {
        return this.aid();
     }
     //console.log(this.name+'::ENDING');
  return 'zzz';
};

Creep.prototype.squatter = function() {
    if(this.requestTask('squat')){
        return this.squat();
    }
    return 'zzz';
};

Creep.prototype.toad = function() {
    this.room.visual.circle(this.pos,
    {fill: 'transparent', radius: 3, stroke: 'yellow'});
  //state flipper
  if (this.carry.energy < this.carryCapacity) {
    this.memory.state = 0;
  }
  if (this.carry.energy === this.carryCapacity) {
    this.memory.state = 1;
  }
  this.sweepAura();
  this.depositAura();
  if (this.room.controller.my) {
    this.eatAura();
  }
  this.mineAura();
  var roomMaxed = this.room.energyAvailable == this.room.energyCapacityAvailable
    ? 1
    : 0;
  if (this.memory.hungry) {
    if (this.requestTask('eat')) {
      this.requestTask('mine');
      return this.eat();
    }
  } else {
    if(!this.fixAura()){
      if(!this.constructAura()){

           this.upgradeAura();

      }else{
          this.mineAura();
      }
    }
    //
    //primary tasks in order of importance inside of state logic
    if (this.requestTask('mine')) {
      return this.mine();
    } else if (this.requestTask('fix')) {
      return this.fix();
    } else if (this.requestTask('eat')) {
      return this.eat();
    } else if (this.requestTask('upgrade')) {
      return this.upgrade();
    }
    return Memory.emoji.frog;
  }
};

function tower(structure) {
  if (!structure.room.memory.tower.whack) {
    structure.room.memory.tower.whack = [];
  }
  var enemies = Memory.rooms[structure.room.name].tower.whack;
  var hurt = Memory.rooms[structure.room.name].tower.aid;
  var damaged = Memory.rooms[structure.room.name].tower.fix;
  if (!structure.room.memory.towers) {
    structure.room.memory.towers = {};
  }
  if (!structure.room.memory.towers[structure.id]) {
    structure.room.memory.towers[structure.id] = {};
    structure.room.memory.towers[structure.id].mode = 'alert';
  }
  if (structure.energy <= 100 || enemies.length > 0) {
    structure.room.memory.towers[structure.id].mode = 'alert';
  } else {
    structure.room.memory.towers[structure.id].mode = 'repair';
  }
  var mode = structure.room.memory.towers[structure.id].mode;
  if (mode == 'alert') {
    if (enemies.length > 0) {
      if (enemies.length > 1) {
        enemies.sort(function(a, b) {
          return a.hits - b.hits;
        });
      }
      structure.attack(Game.getObjectById(enemies[0]));
    } else if (hurt.length > 0) {
      if (hurt.length > 1) {
        hurt.sort(function(a, b) {
          return a.hits - b.hits;
        });
      }
      structure.heal(hurt[0]);
    }
  } else if (mode == 'repair') {
    structure.repair(Game.getObjectById(damaged[0]));
    structure.heal(Game.getObjectById(hurt[0]));
  }
}
//not using this yet, not sure it makes sense to divide their tasks
StructureTower.prototype.requestTask = function(task) {
  if (!this.room.memory.towers[this.id]) {
    this.room.memory.towers[this.id] = {};
  }
  Memory.rooms[this.room.name].towers[this.id][task] = Game.rooms[this.room.name].releaseTask('tower', task);
  if (Memory.rooms[this.room.name].towers[this.id][task]) {
    Memory.rooms[this.room.name].tower[task].push(Memory.rooms[this.room.name].towers[this.id][task]);
    return true;
  } else {
    Memory.rooms[this.room.name].towers[this.id][task] = null;
    return false;
  }
};

Memory.emoji = {
  //EMOJI CAUSE YOLO
  frog: '🐸',
  construct: '🛠️️',
  deconstruct: '⛏',
  fix: '🏚️',
  mine: '💰',
  upgrade: '⚡',
  eat: '🍽️',
  deposit: '✨',
  collect: '✨',
  oops: '☠️',
  whack: '⚔️',
  pew: '🔫',
  aid: '💊',
  sweep: '✨',
  suicide: '💮',
  sogood: '✨🐸✨',
  hop: '💨'
};

//first set memory structures
if (Memory.recipes) {
  Memory.recipes = {};
  Memory.recipes.frog = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, CARRY, MOVE, WORK
      ],
      //rcl2 300 - 550
      2: [
        MOVE, CARRY, MOVE, WORK
      ],
      //rcl3 550 - 800
      3: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 8 5600 - 12900
      8: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ]

    },
    options: {
      //add role for creep function call
      role: 'frog',
      //limit resource type to avoid chemical poisoning
      resourceType: RESOURCE_ENERGY,
      tasks: {
        construct: null,
        collect: null,
        fix: null,
        sweep: null,
        mine: null,
        eat: null,
        upgrade: null
      }
    }
  };
  Memory.recipes.newt = {
    parts: {
      //rcl1 300 energy
      1: [MOVE, CARRY, MOVE, CARRY],
      //rcl2 300 - 550
      2: [MOVE, CARRY, MOVE, CARRY],
      //rcl3 550 - 800
      3: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
      //rcl 4 800 - 1300
      4: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,MOVE,CARRY],
      //rcl 5 1300 - 1800
      5: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
      //rcl 6 1800 - 2300
      6: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
      //rcl 7 2300 - 5600
      7: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY],
      //rcl 8 5600 - 12900
      8: [MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY,MOVE,CARRY]
    },
    options: {
      //add role for creep function call
      role: 'newt',
      //limit resource type to avoid chemical poisoning
      resourceType: RESOURCE_ENERGY,
      tasks: {
        deposit: null,
        collect: null,
        sweep: null,
        eat: null
      }
    }
  };
  Memory.recipes.minnow = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, CARRY, MOVE, CARRY
      ],
      //rcl2 300 - 550
      2: [
        MOVE, CARRY, MOVE, CARRY
      ],
      //rcl3 550 - 800
      3: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 8 5600 - 12900
      8: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY
      ]

    },
    options: {
      //add role for creep function call
      role: 'minnow',
      tasks: {
        eat: null
      },
      to: null,
      from: null
    }
  };
  Memory.recipes.claimer = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, CLAIM
      ],
      //rcl2 300 - 550
      2: [
        MOVE, CLAIM
      ],
      //rcl3 550 - 800
      3: [
        MOVE, CLAIM
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE, CLAIM, CLAIM
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE, CLAIM, CLAIM
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE, CLAIM, CLAIM
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE, CLAIM, CLAIM
      ],
      //rcl 8 5600 - 12900
      8: [MOVE, CLAIM, CLAIM]
    },
    options: {
      //add role for creep function call
      role: 'claimer',
      tasks: {
        claim: null
      }
    }
  };
  Memory.recipes.shark = {
    parts: {
      //rcl1 300 energy
      1: [
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        ATTACK
      ],
      //rcl2 300 - 550
      2: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl3 550 - 800
      3: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl 4 800 - 1300
      4: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl 5 1300 - 1800
      5: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl 6 1800 - 2300
      6: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl 7 2300 - 5600
      7: [
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        TOUGH,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        MOVE,
        ATTACK,
        ATTACK,
        ATTACK,
        ATTACK
      ],
      //rcl 8 5600 - 12900
      8: [
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        RANGED_ATTACK,
        MOVE,
        HEAL,
        MOVE,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL,
        HEAL
      ]
    },
    options: {
      //add role for creep function call
      role: 'shark',
      tasks: {
        whack: null,
        eat: null,
        defend: null
      }
    }
  };
  Memory.recipes.squatter = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, CLAIM
      ],
      //rcl2 300 - 550
      2: [
        MOVE, CLAIM
      ],
      //rcl3 550 - 800
      3: [
        MOVE, CLAIM
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE, CLAIM
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE, CLAIM
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE, CLAIM
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE, CLAIM
      ],
      //rcl 8 5600 - 12900
      8: [MOVE, CLAIM]
    },
    options: {
      //add role for creep function call
      role: 'squatter',
      tasks: {
        squat: null
      },
      squatTarget: ''
    }
  };
  Memory.recipes.toad = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, WORK, CARRY, WORK
      ],
      //rcl2 300 - 550
      2: [
        MOVE, WORK, CARRY, WORK
      ],
      //rcl3 550 - 800
      3: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        CARRY
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        CARRY
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        CARRY
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        CARRY,
        CARRY
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        MOVE,
        CARRY
      ],
      //rcl 8 5600 - 12900
      8: [
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE
      ]

    },
    options: {
      //add role for creep function call
      role: 'toad',
      //limit resource type to avoid chemical poisoning
      resourceType: RESOURCE_ENERGY,
      builtcontainer: 0,
      tasks: {
        construct: null,
        fix: null,
        sweep: null,
        mine: null,
        eat: null,
        upgrade: null
      }
    }
  };
}
Memory.emoji = {
  //EMOJI CAUSE YOLO
  frog: 'ðŸ¸',
  construct: 'ðŸ› ï¸ï¸',
  deconstruct: 'â›',
  fix: 'ðŸšï¸',
  mine: 'ðŸ’°',
  upgrade: 'âš¡',
  eat: 'ðŸ½ï¸',
  deposit: 'âœ¨',
  collect: 'âœ¨',
  oops: 'â˜ ï¸',
  whack: 'âš”ï¸',
  pew: 'ðŸ”«',
  aid: 'ðŸ’Š',
  sweep: 'âœ¨',
  suicide: 'ðŸ’®',
  sogood: 'âœ¨ðŸ¸âœ¨',
  hop: 'ðŸ’¨'
};
Memory.costMatrix = new PathFinder.CostMatrix();
var CM = Memory.costMatrix;
//export my loop logic
module.exports.loop = function() {
    //console.clear();
  //start by initializing memory and cost matrixes per room
  CM._bits.fill(255);
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
        shark: 0,
        squatter: 0
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
        console.log('PARENT: '+Memory.rooms[room.name].parentRoom+' -> CHILD:'+room.name)
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
   console.log("cpu used: " + Game.cpu.getUsed());
  console.log("total creep: " + Object.keys(Game.creeps).length);
//   console.log("cpu/creep: " + Game.cpu.getUsed() / Object.keys(Game.creeps).length);
//console.log(JSON.stringify(Memory));
//console.clear();
};

//first set memory structures
if (!Memory.recipes) {
  Memory.recipes = {};
  Memory.recipes.frog = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, CARRY, MOVE, WORK
      ],
      //rcl2 300 - 550
      2: [
        MOVE, CARRY, MOVE, WORK
      ],
      //rcl3 550 - 800
      3: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ],
      //rcl 8 5600 - 12900
      8: [
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK,
        MOVE,
        CARRY,
        MOVE,
        WORK
      ]
    },
    options: {
      //add role for creep function call
      role: 'frog',
      //limit resource type to avoid chemical poisoning
      resourceType: RESOURCE_ENERGY,
      jobs: {
        construct: null,
        collect: null,
        fix: null,
        sweep: null,
        mine: null,
        eat: null,
        upgrade: null
      }
    }
  };
  Memory.recipes.newt = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, CARRY, MOVE, CARRY
      ],
      //rcl2 300 - 550
      2: [
        MOVE, CARRY, MOVE, CARRY
      ],
      //rcl3 550 - 800
      3: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 8 5600 - 12900
      8: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ]
    },
    options: {
      //add role for creep function call
      role: 'newt',
      //limit resource type to avoid chemical poisoning
      resourceType: RESOURCE_ENERGY,
      jobs: {
        deposit: null,
        collect: null,
        sweep: null,
        eat: null
      }
    }
  };
  Memory.recipes.minnow = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, CARRY, MOVE, CARRY
      ],
      //rcl2 300 - 550
      2: [
        MOVE, CARRY, MOVE, CARRY
      ],
      //rcl3 550 - 800
      3: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY
      ],
      //rcl 8 5600 - 12900
      8: [
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        MOVE,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY,
        CARRY
      ]
    },
    options: {
      //add role for creep function call
      role: 'minnow',
      jobs: {
        eat: null
      },
      to: null,
      from: null
    }
  };
  Memory.recipes.toad = {
    parts: {
      //rcl1 300 energy
      1: [
        MOVE, WORK, CARRY, WORK
      ],
      //rcl2 300 - 550
      2: [
        MOVE, WORK, CARRY, WORK
      ],
      //rcl3 550 - 800
      3: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        CARRY
      ],
      //rcl 4 800 - 1300
      4: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        CARRY
      ],
      //rcl 5 1300 - 1800
      5: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        CARRY
      ],
      //rcl 6 1800 - 2300
      6: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        CARRY,
        CARRY
      ],
      //rcl 7 2300 - 5600
      7: [
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        WORK,
        WORK,
        MOVE,
        CARRY,
        CARRY,
        MOVE,
        CARRY,
        CARRY
      ],
      //rcl 8 5600 - 12900
      8: [
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        WORK,
        CARRY,
        CARRY
      ]
    },
    options: {
      //add role for creep function call
      role: 'toad',
      //limit resource type to avoid chemical poisoning
      resourceType: RESOURCE_ENERGY,
      builtcontainer: 0,
      jobs: {
        construct: null,
        fix: null,
        sweep: null,
        mine: null,
        eat: null,
        upgrade: null
      }
    }
  };
}

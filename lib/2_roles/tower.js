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

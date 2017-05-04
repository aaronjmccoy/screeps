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

Room.prototype.roleCount = function (roleString) {
 //console.log('counting '+roleString+'s in '+this.name);
 let count = this.find(FIND_MY_CREEPS, { filter: (c) => c.memory.role == roleString });
 //console.log(count.length);
 return count.length;
};
//counts open spots around sources
Room.prototype.miningSpots = function (sources) {
 //initialize vars
 var r = this;
 var miningspots = 0;
 var area = [];
 //var mt = r.memory.jobs.mine.tasks;
 //Peek at the result by uncommenting the line below
 //console.log("sources: "+JSON.stringify(sources));
 sources.forEach(
  function (source) {
   //Iterate over the source
   //console.log("source: "+source)
   //search the 3x3 grid with the source at the center
   var sid = source.id;
   //console.log('adding ' + sid + ' to jobs list');
   r.memory.jobs.mine.tasks.push(sid);
   //r.memory.jobs.list.add(sid);
   //console.log(sid);
   area = (r.lookForAtArea('terrain', (source.pos.y) - 1, (source.pos.x) - 1, (source.pos.y) + 1, (source.pos.x) + 1, true));
   //console.log("result: "+JSON.stringify(area.length));
   for (var j = 0; j < area.length; j++) {
    //uncomment to see the grid printed
    //console.log(j+": "+JSON.stringify(area[j]));
    if (area[j].terrain == ('plain') || area[j].terrain == ('swamp')) {
     miningspots++;
     //console.log(miningspots);
     //if the terrain is swamp or plain add a mining spot
     if (!r.memory.sources) {
      r.memory.sources = {};
     }
     if (!r.memory.sources[sid]) {
      r.memory.sources[sid] = {};
     }
     if (!r.memory.sources[sid].spots) {
      r.memory.sources[sid].spots = {};
     }
     if (!r.memory.sources[sid].spots[miningspots]) {
      r.memory.sources[sid].spots[miningspots] = 'empty';
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

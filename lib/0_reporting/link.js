StructureLink.prototype.report = function() {
	if(!Memory.rooms[this.room.name].links[this.id]) {
		Memory.rooms[this.room.name].links[this.id] = {
			"to": null
		};
	}
	if(Game.getObjectById(Memory.rooms[this.room.name].links[this.id].to)) {
		Memory.rooms[this.room.name].toad.deposit.push(this.id);
		Memory.rooms[this.room.name].frog.collect.push(this.id);
		Memory.rooms[this.room.name].newt.collect.push(this.id);
		if(Game.getObjectById(Memory.rooms[this.room.name].links[this.id].to).energy < 700 && this.energy > 100) {
			this.transferEnergy(Game.getObjectById(Memory.rooms[this.room.name].links[this.id].to));
		}
	}
	if(!Memory.rooms[this.room.name].links[this.id].to && this.energy > 0) {
		Memory.rooms[this.room.name].toad.collect.push(this.id);
		Memory.rooms[this.room.name].frog.collect.push(this.id);
		Memory.rooms[this.room.name].newt.collect.push(this.id);
	}
};

Source.prototype.report = function () {
 CM.set(this.pos.x, this.pos.y, 255);
 this.room.memory.jobs.mine.push(this.id);
};

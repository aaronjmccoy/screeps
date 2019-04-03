Creep.prototype.squatter = function() {
    if(this.requestTask('squat')){
        return this.squat();
    }
    return 'zzz';
};

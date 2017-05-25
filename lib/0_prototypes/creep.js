//eat action
Creep.prototype.eat = function (home) {
 return home.renewCreep(this);
};
//sacrifice action
Creep.prototype.sacrifice = function (home) {
 return home.recycleCreep(this);
};

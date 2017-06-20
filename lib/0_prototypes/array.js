Object.defineProperty(Array.prototype, 'add', {
 enumerable: false,
 value: function (element) {
  if (this.length) {
   var set = new Set(this);
   //console.log('set as array before splice');
   //console.log(this);
   //console.log([...set]);
   //console.log('set size: ' + set.size);
   //console.log('does set have ' + element + ': ' + set.has(element));
   if (!set.has(element)) {
    set = set.add(element);
   }
   //console.log('set size after adding ' + element + ': ' + set.size);
   set.forEach(function (value1, value2, set) {
    //console.log('s[' + value1 + '] = ' + value2);
   });
   this.splice(0, this.length, ...set);
   //console.log('after splice');
   //console.log(...set);
   //console.log(this);
  } else {
   this.push(element);
  }
 }
});

Object.defineProperty(Array.prototype, 'delete', {
 enumerable: false,
 value: function (element) {
  if (this.length) {
   var set = new Set(this);
   if (set.has(element)) {
    set = set.delete(element);
   }
   this.splice(0, this.length, ...set);
  }
  return this;
 }
});

Object.defineProperty(Array.prototype, 'has', {
 enumerable: false,
 value: function (element) {
  let arr = this;
  var set = new Set(arr);
  return set.has(element);
 }
});

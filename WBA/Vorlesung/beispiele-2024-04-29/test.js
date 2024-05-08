console.log("Test");

let empty = {};

let animal = {
  'name': '',
  'age': 0,
  'eat': function (food) {
      console.log('mmpf mmpf, ' + food + '!');
  }
};

let cat = Object.create(animal);
cat.eat('mouse');
console.log(cat.age);

cat.meow = function() {
    console.log('Miauuu!');
};
cat.meow();

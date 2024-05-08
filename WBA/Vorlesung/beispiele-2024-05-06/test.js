console.log("Test");

/*

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

let vegetarianCat = Object.create(cat);

vegetarianCat.eat = function (food) {
    if (food.indexOf('mouse') >= 0) {
        console.log("I don't like mice");
    } else {
        this.__proto__.eat(food);
    } 
};

vegetarianCat.eat('mouse');

*/

/*
function Animal(name, age) {
    this.name = name;
    this.age = age;
}

Animal.prototype.eat = function (food) {
    console.log('mmpf mmpf, ' + food + '!');
};

let fish = new Animal('Nemo', 2);
console.log(fish.age);
fish.eat('alga');

function Cat(name, age, type) {
    Animal.call(this, name, age);
    this.type = type;
}

Cat.prototype = new Animal();
Cat.prototype.constructor = Cat;
Cat.prototype.meow = function() {
    console.log('Miauuu!');
};
Cat.prototype.eat = function (food) {
    Animal.prototype.eat.call(this, food);
};

let cat = new Cat('Kitty', 2, 'Angora');
cat.meow();
*/ 

class Animal {
    constructor(name, age) {
        this._name = name;
        this._age = age;
    }  
    eat(food) {
        console.log('Mmpf mmpf, ' + food + '!');
    }
    get name() {
        return (this._name);
    }
    set name(name) {
        this._name = name;
    }
}

let snake = new Animal('Hydra', 4);
snake.eat('mouse');
snake.name = 'Henry';
console.log(snake.name);

class Cat extends Animal {
    constructor(name, age, type) {
        super(name, age);
        this._type = type;
    }
    meow () {
        console.log('Miauuu!');
    }
}

let cat = new Cat ('Kitty', 4, 'Angora');
cat.meow();
cat.eat('mice');

let a = [ 33, 4, 1111, 222];
console.log(a);
a.sort();
console.log(a);

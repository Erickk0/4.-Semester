 /**
 * Represents an Animal.
 * @constructor
 */
function Animal() {
    this.age = 0;
    this.averageAge = 0;
}

/**
 * Gets the age of the animal.
 * @returns {number} The age of the animal.
 */
Animal.prototype.getAge = function() {
    return this.age;
}

/**
 * Sets the age of the animal.
 * @param {number} newAge - The new age to set.
 */
Animal.prototype.setAge = function(newAge) {
    this.age = newAge;
}

/**
 * Gets the average age of the animal.
 * @returns {number} The average age of the animal.
 */
Animal.prototype.getAverageAge = function() {
    return this.averageAge;
}

/**
 * Represents an Elephant.
 * @constructor
 * @extends Animal
 */
function Elephant() {
    Animal.call(this);
    this.averageAge = 70;
}

Elephant.prototype = Object.create(Animal.prototype);
Elephant.prototype.constructor = Elephant;
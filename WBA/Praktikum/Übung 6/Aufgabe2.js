function Animal(avgage, name) {
    this.avgage = avgage;
    this.name = name;

}

Animal.prototype.setAge = function(age) {
    console.log("Age: " + age);
}

Animal.prototype.getAge = function(age) {
    console.log("Age: " + age);
}

    let Elephant = new Animal(70, "Tizian");
    console.log("Elephant: ", Elephant.name ,Elephant.avgage);
    Elephant.setAge(20);
# Brutal Alien Tower Defense

## SETUP

* install nodejs 6+
* run `npm install`
* start with npm start (clean build watch connect)
* connect to <http://localhost:6660/>


## TODO

### RENDER

* popup with actions doable on clicked tile

### GRID

* grid collision (using elevation)
* improve grid / entity move API
* do the same grid API improvements on Entity.frame

### ENTITY

* move entities to separate files
* register inherited entities on base Entity
* move Game.deserializer to Entity.load
* move Game.add code to Entity.constructor
* move Game.delete to Entity.delete
* make Entity account subclasses (e.g., Mob.count++)


var World = function World(callback) {

    callback(); // tell Cucumber we're finished and to use 'this' as the world instance
};
exports.World = World;
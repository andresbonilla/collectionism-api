var stepDefinitions = function () {
  this.World = require("../support/world.js").World;

  this.When(/^I signup with username "([^"]*)", password "([^"]*)", and email "([^"]*)"$/, function(username, password, email, callback) {
      console.log(this.World);
      callback();
  });

};

module.exports = stepDefinitions;
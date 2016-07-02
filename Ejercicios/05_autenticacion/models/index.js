var models = ['./nave.model', './puerto.model'];

exports.initialize = function() {
  models.forEach(function(model){
    require(model)();
  });
};
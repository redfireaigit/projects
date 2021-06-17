const Meal = require("../models/meal.model");
const _ = require("lodash");
const {ResponseHandler} = require('../../httpStatusCodes')

// Get list of meals
exports.index = function(req, res) {
  Meal.find({$where: {isActive: 1}}, function(err, meals) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    } else
    ResponseHandler(res, 200, meals )
  });
};

// Get a single meal
exports.show = function(req, res) {

  Restaurant.findById(req.params.resId, function(err, restaurant) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    }
    else if (!restaurant) {
      ResponseHandler(res, 404)
    }

    else if (restaurant.user != req.user._id) {
      ResponseHandler(res, 401)
    }
    else {
      let findMeal = restaurant._meals.filter(f => f == req.params.id);

      if(findMeal.length) {
        Meal.findById(req.params.id, function(err, meal) {
          if (err) {
            ResponseHandler(res, 500, null, err)
          }
          else if (!meal) {
            ResponseHandler(res, 404)
          } else
          ResponseHandler(res, 200, meal )
        });
      } else {
        ResponseHandler(res, 404)
      }
    }
  });
};

exports.create = function(req, res) {
  Restaurant.findById(req.body.id, function(err, restaurant) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    }
    else if (!restaurant) {
      ResponseHandler(res, 404)
    }

    else if (restaurant.user != req.user._id) {
      ResponseHandler(res, 401)
    }
    else{
      Meal.create(req.body._meals, function(err) {
        if (err) {
          ResponseHandler(res, 500, null, err)
        }
        else {
          for (let i = 0; i < arguments[1].length; i++) {
            restaurant._meals.push(arguments[1][i]._id);
          }
          Restaurant.findByIdAndUpdate(req.body.id,restaurant, function(err, restaurant) {
            if (err) {
              ResponseHandler(res, 500, null, err)
            }
            else if (!restaurant) {
              ResponseHandler(res, 404)
            }
            else
              ResponseHandler(res, 200, restaurant )

          });
        }
      });
    }
  });
};

// Updates an existing meal in the DB.
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Restaurant.findById(req.body.id, function(err, restaurant) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    }
    else if (!restaurant) {
      ResponseHandler(res, 404)
    }
    else if (restaurant.user != req.user._id) {
      ResponseHandler(res, 401)
    }
    else {
      let findMeal = restaurant._meals.filter(f => f == req.params.id);

      if(findMeal.length) {
        Meal.findById(req.params.id, function(err, meal) {
          if (err) {
            ResponseHandler(res, 500, null, err)
          }
          else if (!meal) {
            ResponseHandler(res, 404)
          }
          else {
            const updated = _.merge(meal, req.body._meal);
            updated.save(function(err) {
              if (err) {
                ResponseHandler(res, 500, null, err)
              } else
              ResponseHandler(res, 200, meal )
            });
          }

        });
      } else {
        ResponseHandler(res, 404)
      }
    }

  })
};

// Deletes a meal from the DB.
exports.destroy = function(req, res) {
  Restaurant.findById(req.body.id, function (err, restaurant) {
    if (err) {
      ResponseHandler(res, 500, null, err)
    }
    else if (!restaurant) {
      ResponseHandler(res, 404)
    }

    else if (restaurant.user != req.user._id) {
      ResponseHandler(res, 401)
    }
    else {
      let findMeal = restaurant._meals.filter(f => f == req.params.id);

      if (findMeal.length) {
        restaurant._meals = restaurant._meals.filter(f => f != req.params.id);
        restaurant.save(function (err) {
          if (err) {
            ResponseHandler(res, 500, null, err)
          }
          else {
            Meal.findById(req.params.id, function (err, meal) {
              if (err) {
                ResponseHandler(res, 500, null, err)
              }
              else if (!meal) {
                ResponseHandler(res, 404)
              }
              else {
                meal.isActive = 0;
                meal.save(function (err) {
                  if (err) {
                    ResponseHandler(res, 500, null, err)
                  }
                  ResponseHandler(res, 200, meal )
                });
              }

            });
          }

        });

      } else {
        ResponseHandler(res, 404)
      }
    }


  });
}

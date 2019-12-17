console.log("Add Recipe JS Linked");

$(document).ready(function() {
  // Gets ID of chef that is currently logged in
  $.get("/api/user_data").then(function(data) {
    chefId = data.id;
  });

  var chefId;
  var ingredientID = 3;
  var stepID = 3;
  var categoryIds = [];

  // Creates extra field to add another ingredient if needed
  $(document).on("click", "#add-ingredient", function() {
    if (ingredientID === 15) {
      alert("Only 15 Ingredients allowed");
      return false;
    } else {
      var newIngredientField = $(
        "<input type='text' class='form-control mb-1'>"
      ).attr("id", "ingredient-" + (ingredientID + 1));
      $("#list-ingredients").append(newIngredientField);

      ingredientID++;
      console.log(ingredientID);
    }
  });

  // Creates extra field to add another ingredient if needed
  $(document).on("click", "#add-step", function() {
    if (stepID === 15) {
      alert("Only 15 Steps allowed");
      return false;
    } else {
      var newInstructionField = $(
        "<input type='text' class='form-control mb-1'>"
      ).attr("id", "step-" + (stepID + 1));
      $("#list-instructions").append(newInstructionField);

      stepID++;
      console.log(stepID);
    }
  });

  // Submits recipe to be added
  $(document).on("click", "#add-recipe", function(event) {
    event.preventDefault();
    var recipeTitle = $("#recipeName")
      .val()
      .trim();
    var recipeDesc = $("#recipeDescription")
      .val()
      .trim();

    var ingredients = "";
    var instructions = "";
    var recipeImg = $("#recipeImg")
      .val()
      .trim();

    getIngredients();
    getInstructions();

    categoryIds = getCategories();

    var newRecipe = {
      // eslint-disable-next-line camelcase
      ChefId: chefId,
      name: recipeTitle,
      description: recipeDesc,
      ingredients: ingredients,
      steps: instructions,
      // eslint-disable-next-line camelcase
      imgURL: recipeImg,
      categories: JSON.stringify(categoryIds)
    };

    // Gets all ingredients and joins them as a string
    // with special separator flags in between
    function getIngredients() {
      var listOfIngredients = [];
      for (var i = 1; i <= ingredientID; i++) {
        listOfIngredients.push(
          $("#ingredient-" + i)
            .val()
            .trim()
        );
      }
      ingredients = listOfIngredients.join("&|");
    }

    // Gets all instructions and joins them as a string
    // with special separator flags in between
    function getInstructions() {
      var listOfInstructions = [];
      for (var i = 1; i <= stepID; i++) {
        listOfInstructions.push(
          $("#step-" + i)
            .val()
            .trim()
        );
      }
      instructions = listOfInstructions.join("&|");
    }

    // Gets all checked categories and adds them to an array
    // by category ID
    function getCategories() {
      var categoryIds = [];

      for (var i = 1; i <= 4; i++) {
        if ($("#category-" + i + "-checkbox").is(":checked")) {
          categoryIds.push(i);
        }
      }

      return categoryIds;
    }

    // Posts recipe to database
    $.post("/api/recipes", newRecipe).then(function(response) {
      if (response) {
        window.location.replace("/recipe/" + response.id);
        var successMsg = $(
          "<p class='text-success'> Article Added Succesfully!</p>"
        );
        $("#success-fail").append(successMsg);
      } else {
        var failMsg = $(
          "<p class='text-danger'> Something Went Wrong, Try Again Later.</p>"
        );
        $("#success-fail").append(failMsg);
      }
    });
  });
});

import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { ShoppingListService } from '../shopping-list/shopping-list.service';
import { Subject } from 'rxjs';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe(
      1,
      'A Test Recipe',
      'This is simply a test',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [
        new Ingredient('Pepper', 2),
        new Ingredient('Egg', 5)
      ]
    ),
    new Recipe(
      2,
      'Another Test Recipe',
      'This is simply another test',
      'https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg',
      [
        new Ingredient('Tomato', 1),
        new Ingredient('Banana', 2)
      ]
    ),
  ];

  recipeSelected = new Subject<Recipe>();

  constructor(private shoppingListService: ShoppingListService) {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  sendToShoppingList(ingredients: Ingredient[]) {
    this.shoppingListService.addIngredients(ingredients);
  }

  addRecipe(recipe: Recipe) {
    recipe.id = this.recipes.length;
    this.recipes.push(recipe);
  }

  updateRecipe(recipe: Recipe) {
    const recipeToUpdate = this.recipes.find(r => r.id === recipe.id );
    recipeToUpdate.name = recipe.name;
    recipeToUpdate.imagePath = recipe.imagePath;
    recipeToUpdate.description = recipe.description;
    recipeToUpdate.ingredients = recipe.ingredients.slice();
  }
}

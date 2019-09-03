import { Recipe } from './recipe.model';
import { Ingredient } from '../shared/ingredient.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Store } from '@ngrx/store';
import { AddIngredients } from '../shopping-list/store/shopping-list.actions';
import * as fromRoot from '../store/root.reducer';

@Injectable()
export class RecipeService {
  private recipes: Recipe[] = [];

  recipesChanged = new Subject<Recipe[]>();
  recipeSelected = new Subject<Recipe>();

  constructor(private store: Store<fromRoot.State>) {}

  getRecipes() {
    return this.recipes.slice();
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }

  getRecipe(id: number) {
    return this.recipes.find(recipe => recipe.id === id);
  }

  sendToShoppingList(ingredients: Ingredient[]) {
    this.store.dispatch(new AddIngredients(ingredients));
  }

  addRecipe(recipe: Recipe) {
    recipe.id = this.recipes.length;
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(recipe: Recipe) {
    const recipeToUpdate = this.recipes.find(r => r.id === recipe.id );
    recipeToUpdate.name = recipe.name;
    recipeToUpdate.imagePath = recipe.imagePath;
    recipeToUpdate.description = recipe.description;
    recipeToUpdate.ingredients = recipe.ingredients.slice();
    this.recipesChanged.next(this.recipes.slice());
  }
}

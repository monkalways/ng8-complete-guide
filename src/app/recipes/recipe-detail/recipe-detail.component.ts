import { Component, OnInit, Input } from '@angular/core';
import { Recipe } from '../recipe.model';
import { RecipeService } from '../recipe.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-recipe-detail',
  templateUrl: './recipe-detail.component.html',
  styleUrls: ['./recipe-detail.component.css']
})
export class RecipeDetailComponent implements OnInit {
  @Input() recipe: Recipe;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.recipe = this.recipeService.getRecipe(+params.id);
    });
  }

  onToShoppingListClick() {
    this.recipeService.sendToShoppingList(this.recipe.ingredients);
  }

  onEdit() {
    this.router.navigate(['edit'], {relativeTo: this.route});
  }
}

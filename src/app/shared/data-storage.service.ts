import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RecipeService } from '../recipes/recipe.service';
import { Recipe } from '../recipes/recipe.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DataStorageService {
  constructor(private http: HttpClient, private recipeService: RecipeService) {}

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http
      .post(environment.backEndURL + '/recipes', { recipes })
      .subscribe((response) => {
        console.log(response);
      });
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(environment.backEndURL + '/recipes')
      .subscribe((recipes) => {
        this.recipeService.setRecipes(recipes);
      });
  }
}

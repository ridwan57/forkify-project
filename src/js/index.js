// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader } from './views/base';

const state = {};

const controlsearch = async () => {


    const query = searchView.getInput();
    console.log(query);
    if (query) {
        state.search = new Search(query);
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes)

        try {
            await state.search.getResults();
            clearLoader();
            searchView.renderResults(state.search.result);
        }
        catch (error) {
            alert('Something went wrong with searching ...');

        }
    }


}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlsearch();


})




elements.searchResPages.addEventListener('click', e => {

    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
    }
})

//Recipe strt!!!



///go

const controlRecipe = async () => {

    // Get the Id from the URL
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {

        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //Create new recipe Object
        if (state.search) {
            console.log('index.js');
            searchView.highlightSelected(id);
        }


        state.recipe = new Recipe(id);

        try {

            //Get recipe data
            await state.recipe.getRecipe();
            console.log(state.recipe.ingredients);
            state.recipe.parseIngredients();

            //Calculate servings and time

            state.recipe.calcTime();
            state.recipe.calcSavings();
            //render recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
            console.log(state.recipe);
        }
        catch (error) {
            alert('Error Processing Recipe');
        }



    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
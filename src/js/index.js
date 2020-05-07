// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
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

elements.searchView.addEventListener('submit', e => {
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


        //Create new recipe Object

        state.recipe = new Recipe(id);
        try {

            //Get recipe data
            await state.recipe.getRecipe();

            //Calculate servings and time

            state.recipe.calcTime();
            state.recipe.calcSavings();
            console.log(state.recipe);
        }
        catch (error) {
            alert('Error Processing Recipe');
        }



    }
}

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));
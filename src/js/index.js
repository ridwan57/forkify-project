// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
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
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
            console.log(state.recipe);
        }
        catch (error) {
            alert('Error Processing Recipe');
        }



    }
}
// Restore liked recipes on page load
window.addEventListener('load', () => {
    state.likes = new Likes();

    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

// List Controller

const controlList = () => {
    if (!state.list) state.list = new List();
    state.recipe.ingredients.forEach(el => {

        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}



['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

// Handling recipe button click

elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {


            console.log('click inc');
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
        else {
            alert('You cannot decrease anymore!');
        }
    }

    else if (e.target.matches('.btn-increase, .btn-increase *')) {
        console.log('click dec');
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);

    }
    else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        console.log('btn-clicked');

        controlList();

    }
    else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller
        controlLike();
    }
    console.log(state.recipe);
});


/** 
 * LIKE CONTROLLER
 */
state.likes = new Likes();
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    // User has NOT yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        // Add like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        // Toggle the like button
        likesView.toggleLikeBtn(true);

        // Add like to UI list
        likesView.renderLike(newLike);

        // User HAS liked current recipe
    } else {
        // Remove like from the state
        state.likes.deleteLike(currentID);

        // Toggle the like button
        likesView.toggleLikeBtn(false);

        // Remove like from UI list
        likesView.deleteLike(currentID);
    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};


// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id);

        // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    }

});

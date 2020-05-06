// Global app controller
import Search from './models/Search';
import * as searchView from './views/searchView';
import { elements } from './views/base';

const state = {};

const controlsearch = async () => {
    const query = searchView.getInput();
    console.log(query);
    if (query) {
        state.search = new Search(query);
        searchView.clearInput();
        searchView.clearResults();

        await state.search.getResults();

        searchView.renderResults(state.search.result);
    }


}

elements.searchView.addEventListener('submit', e => {
    e.preventDefault();
    controlsearch();

})


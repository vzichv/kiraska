import { makeAutoObservable } from 'mobx';

class Store {
  allDetails = [];
  full = true;
  filters = {
    count: { name: null, filter: null }
  };

  constructor() {
    makeAutoObservable(this);
  }

  set setAllDetails(details) {
    this.allDetails = details;
  }

  set setDetailsWithOnlyChanges(changes) {
    this.detailsWithOnlyChanges = changes;
  }

  set setCountFilter(filter) {
    let filters = this.filters;
    filters.count = filter;
    
    this.filters = filters;
  }

  updateFull(full) {
    this.full = full;
  }
}

export default new Store();
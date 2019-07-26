import { types } from 'mobx-state-tree'
import { MLTaskStore } from './MLTaskStore'
import { MLResultsStore } from './MLResultsStore'
import { MLSelectionStore } from './MLSelectionStore'

const AppStore = types.model('AppStore', {
  
  user: types.optional(types.string, 'Anonymous'),  
  mlTask: types.optional(MLTaskStore, {}),  // We can use {} to set the initial values of a store
  mlResults: types.optional(MLResultsStore, {}),
  mlSelection: types.optional(MLSelectionStore, {}),
  
}).actions(self => {
  return {
    
    setUser (val) {
      self.user = val
    },
    
  }
})

export { AppStore }

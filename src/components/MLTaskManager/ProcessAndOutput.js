import React from 'react'
import { observer } from 'mobx-react'
import Papa from 'papaparse'

import AppContext from '@store'
import { ASYNC_STATES, stopEvent } from '@util'

class ProcessAndOutput extends React.Component {
  constructor (props) {
    super(props)
  }
  
  render () {
    const mlTask = this.context.mlTask
    const mlResults = this.context.mlResults
    const mlSelection = this.context.mlSelection
    
    // If the results aren't ready, don't render this component.
    if (mlTask.status !== ASYNC_STATES.SUCCESS || mlResults.status !== ASYNC_STATES.SUCCESS) {
      return null
    }
    
    return (
      <form className="form" onSubmit={(e) => { return stopEvent(e) }}>
        <h2>Process Selected Images</h2>
        <div className="info panel">
          You have selected {mlSelection.selection.length} images to process. You have a choice to...
        </div>
        <fieldset>
          <button
            className="action button"
            onClick={this.doExport.bind(this)}
          >
            Export to CSV
          </button>
        </fieldset>
      </form>
    )
  }
  
  doExport () {
    const mlSelection = this.context.mlSelection
    const selection = mlSelection.selection.toJSON()
    const csvData = Papa.unparse(selection)
    
    console.log('+++ csvData\n', csvData)
  }
}

ProcessAndOutput.contextType = AppContext

export default observer(ProcessAndOutput)

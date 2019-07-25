import React from 'react'
import { observer } from 'mobx-react'
import AppContext from '@store'
import { ASYNC_STATES, stopEvent } from '@util'

const NUMBER_OF_SAMPLES = 20

class DisplayAndSelect extends React.Component {
  constructor (props) {
    super(props)
  }
  
  render () {
    const mlTask = this.context.mlTask
    const mlResults = this.context.mlResults
    
    // If the results aren't ready, don't render this component.
    if (mlTask.status !== ASYNC_STATES.SUCCESS || mlResults.status !== ASYNC_STATES.SUCCESS) {
      return null
    }
    
    const info = mlResults.data.info || {}
    const images = mlResults.data.images || []
    
    console.log('+++ info ', info)
    
    return (
      <form className="form">
        <h2>Select Subjects</h2>
        <div className="info panel">
          {Object.keys(info).length && Object.keys(info).map(key => (
            <div key={`results-info-${key}`}><b>{key}</b> : <i>{info[key]}</i></div>
          ))}
        </div>
        {this.renderSampleImages(images)}
      </form>
    )
  }

  renderSampleImages(images = []) {
    if (!images || !images.length) return
    
    // Pick a small sample from the images provided
    const numOfSamples = Math.min(images.length, NUMBER_OF_SAMPLES)
    const startIndex = Math.random() * (images.length - numOfSamples)
    const sampleImages = images.slice(startIndex, startIndex + numOfSamples)
    
    return (
      <div className="list">
        {sampleImages.map((image, index) => {
          console.log('+++', image)
          const imgSrc = image.file || ''
          
          return (
            <img src={imgSrc} className="item" key={`results-image-${index}`} />
          )
        })}
      </div>
    
    )
    
    
  }
}

DisplayAndSelect.contextType = AppContext

export default observer(DisplayAndSelect)
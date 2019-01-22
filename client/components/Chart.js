import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import RadarChart from 'react-svg-radar-chart'
import 'react-svg-radar-chart/build/css/index.css'
import axios from 'axios'

/**
 * COMPONENT
 */
class Chart extends Component {
  constructor() {
    super()
    this.state = {
      data: [],
      unweightedScore: 0,
      weightedScore: 0
    }
    this.setData = this.setData.bind(this)
    this.calcUnweighted = this.calcUnweighted.bind(this)
    this.calcWeighted = this.calcWeighted.bind(this)
  }

  async setData(criteria, companyId) {
    let data = []
    let dataObj = {}
    for (const crit of criteria) {
      const sortedList = await axios.get(`/api/companies/sorted/${crit}`)
      sortedList.data.forEach((el, idx) => {
        if (el.id === companyId) {
          const val = idx / sortedList.data.length
          dataObj[crit] = val
        }
      })
    }
    data.push(dataObj)
    this.setState({
      data: data
    })
  }

  calcUnweighted() {
    let newArr = []
    for (let key in this.state.data[0]) {
      newArr.push(this.state.data[0][key])
    }
    const avg =
      Math.round(
        newArr.reduce(
          (accumulator, currentValue) => accumulator + currentValue
        ) /
          newArr.length *
          10000
      ) / 100
    this.setState({
      unweightedScore: avg
    })
  }

  calcWeighted() {
    // console.log(this.props.weights)
    // console.log(this.props.criteria)
    // console.log(this.state.data[0])
    let mappedData = this.props.criteria.map(el => {
      return this.state.data[0][el]
    })
    // weights needs to be pegged to 1

    let weights = this.props.weights.map(el => {
      return Number(el)
    })

    const peg = weights.reduce(
      (accumulator, currentValue) => accumulator + currentValue
    )
    const accWeights = weights.map(el => {
      return el / peg
    })

    const score =
      Math.round(
        mappedData
          .map((el, idx) => {
            return el * accWeights[idx]
          })
          .reduce((accumulator, currentValue) => accumulator + currentValue) *
          10000
      ) / 100
    this.setState({
      weightedScore: score
    })
  }

  async componentDidMount() {
    await this.setData(this.props.criteria, this.props.selectedCompany.id)
    this.calcUnweighted()
    this.calcWeighted()
  }

  render() {
    if (this.state.data.length < 1) {
      return <div>Generating your chart!</div>
    }
    return (
      <div>
        <div>
          <h1>{this.props.selectedCompany.Company_Name}</h1>
          <h2>Equal Weighted Score: {this.state.unweightedScore}%</h2>
          {!isNaN(this.state.weightedScore) ? (
            <h2>Custom Weighted Score: {this.state.weightedScore}%</h2>
          ) : (
            <h2>No Weights Selected</h2>
          )}
        </div>
        <RadarChart
          captions={this.props.captions}
          data={[
            // data
            {
              data: this.state.data[0],
              meta: {color: 'red'}
            }
          ]}
          size={600}
        />
        <div style={{display: 'inline'}}>
          {this.props.criteria.map(el => {
            return (
              // eslint-disable-next-line react/jsx-key
              <p>
                {el}: {this.props.selectedCompany[el]}
              </p>
            )
          })}
        </div>
      </div>
    )
  }
}

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    companies: state.data.companies,
    selectedCompany: state.data.selectedCompany,
    criteria: state.data.criteria,
    captions: state.data.captions,
    data: state.data.data
  }
}

const mapDispatch = dispatch => {
  return {}
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Chart))

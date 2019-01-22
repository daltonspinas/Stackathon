import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import {
  getAllCompanies,
  getSelected,
  setCriteria,
  setCaptions
} from '../store/data'
import {Chart} from './index'

/**
 * COMPONENT
 */
class Landing extends Component {
  constructor() {
    super()
    this.state = {
      criteria: [null],
      weights: [null],
      companyId: null,
      goToChart: false
    }
    this.addCriteria = this.addCriteria.bind(this)
    this.selectedCompany = this.selectedCompany.bind(this)
    this.setCriteria = this.setCriteria.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.setWeights = this.setWeights.bind(this)
  }

  addCriteria() {
    let newCriteria = this.state.criteria
    newCriteria.push(null)
    let newWeights = this.state.weights
    newWeights.push(null)
    this.setState({
      criteria: newCriteria
    })
  }

  setCriteria(evt) {
    evt.preventDefault()
    const newCrit = this.state.criteria.map((el, idx) => {
      if (idx === Number(evt.target.id)) {
        return evt.target.value
      } else {
        return el
      }
    })
    this.setState({
      criteria: newCrit
    })
  }

  setWeights(evt) {
    evt.preventDefault()
    const newWeights = this.state.weights.map((el, idx) => {
      if (idx === Number(evt.target.id)) {
        return evt.target.value
      } else {
        return el
      }
    })
    this.setState({
      weights: newWeights
    })
  }

  selectedCompany(evt) {
    evt.preventDefault()
    this.setState({
      companyId: evt.target.value
    })
    this.props.chooseCompany(evt.target.value)
  }

  async handleSubmit() {
    this.props.sendCriteria(this.state.criteria)
    this.props.chooseCompany(this.state.companyId)
    this.props.sendCaptions(this.state.criteria)
    this.setState({
      goToChart: true
    })
  }
  componentDidMount() {
    this.props.loadCompanies()
  }

  render() {
    if (this.state.goToChart) {
      return <Chart weights={this.state.weights} />
    }
    if (this.props.companies.length < 1) {
      return (
        <div>
          <h1>Loading companies, please wait</h1>
        </div>
      )
    }
    return (
      <div>
        <h1>Stock Analysis Tool</h1>
        <h3>Please select a company</h3>
        <select onChange={this.selectedCompany}>
          <option> S&amp;P 500 Companies</option>{' '}
          {this.props.companies.map(company => {
            return (
              <option key={company.id} value={company.id}>
                {company.Company_Name}
              </option>
            )
          })}
        </select>
        <div>
          <h3 style={{display: 'inline'}}>Choose your criteria and weight</h3>
          <button onClick={this.addCriteria} style={{display: 'inline'}}>
            Add criteria
          </button>
        </div>
        {this.state.criteria.map((crit, idx) => {
          return (
            // eslint-disable-next-line react/jsx-key
            <div key={idx}>
              <select onChange={this.setCriteria} id={idx}>
                {this.props.selectedCompany.Company_Name ? (
                  <option>Available Criteria</option>
                ) : (
                  <option>Please choose a company first</option>
                )}
                {Object.keys(this.props.selectedCompany).map(critName => {
                  if (
                    critName !== 'id' &&
                    critName !== 'createdAt' &&
                    critName !== 'updatedAt' &&
                    critName !== 'Company_Name' &&
                    critName !== 'Ticker_Symbol' &&
                    this.props.selectedCompany[critName] !== null
                  ) {
                    return <option>{critName}</option>
                  }
                })}
              </select>
              <label style={{display: 'inline'}}> {'    '}Weight</label>
              <input type="number" onChange={this.setWeights} id={idx} />
            </div>
          )
        })}
        <button type="submit" onClick={this.handleSubmit}>
          Generate Chart
        </button>
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
    selectedCompany: state.data.selectedCompany
  }
}

const mapDispatch = dispatch => {
  return {
    loadCompanies() {
      dispatch(getAllCompanies())
    },
    chooseCompany(id) {
      dispatch(getSelected(id))
    },
    sendCriteria(criteria) {
      dispatch(setCriteria(criteria))
    },
    sendCaptions(criteria) {
      dispatch(setCaptions(criteria))
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(Landing))

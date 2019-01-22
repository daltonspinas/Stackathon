import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_ALL_COMPANIES = 'GET_ALL_COMPANIES'
const SELECT_COMPANY = 'SELECT_COMPANY'
const SET_CRITERIA = 'SET_CRITERIA'
const SET_CAPTIONS = 'SET_CAPTIONS'
const SET_DATA = 'SET_DATA'

/**
 * INITIAL STATE
 */
const initialState = {
  companies: [],
  selectedCompany: {},
  criteria: [],
  captions: {},
  data: [] //must be an array of objects, keys must match to keys in captions
}

/**
 * ACTION CREATORS
 */
const allCompanies = companies => ({type: GET_ALL_COMPANIES, companies})
const selectCompany = singleCompany => ({type: SELECT_COMPANY, singleCompany})
export const setCriteria = criteria => ({type: SET_CRITERIA, criteria})
export const setCaptions = criteria => {
  let captions = {}
  criteria.forEach(element => {
    captions[element] = element
  })
  return {
    type: SET_CAPTIONS,
    captions
  }
}

// export const setData = async (criteria, companyId) => {
//   let data = []
//   let dataObj = {}
//   for (const crit of criteria) {
//     const sortedList = await axios.get(`/api/companies/sorted/${crit}`)
//     console.log(sortedList)
//     sortedList.data.forEach((el, idx) => {
//       if (el.id === companyId) {
//         const val = idx / sortedList.length / 100
//         dataObj[crit] = val
//       }
//     })
//   }
//   data.push(dataObj)
//   return {
//     type: SET_DATA,
//     data
//   }
// }

/**
 * THUNK CREATORS
 */
export const getAllCompanies = () => async dispatch => {
  try {
    const res = await axios.get('/api/companies')
    dispatch(allCompanies(res.data))
  } catch (err) {
    console.error(err)
  }
}

export const getSelected = id => async dispatch => {
  try {
    const res = await axios.get(`/api/companies/${id}`)
    dispatch(selectCompany(res.data))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_COMPANIES:
      return {...state, companies: action.companies}
    case SELECT_COMPANY:
      return {...state, selectedCompany: action.singleCompany}
    case SET_CRITERIA:
      return {...state, criteria: action.criteria}
    case SET_CAPTIONS:
      return {...state, captions: action.captions}
    case SET_DATA:
      return {...state, data: action.data}
    default:
      return state
  }
}

import {
    FETCH_TRANSACTIONS_FAILURE, 
    FETCH_TRANSACTIONS_REQUEST, 
    FETCH_TRANSACTIONS_SUCCESS
} from './transactionTypes'

const initialState = {
    loading: false,
    transactions: [],
    error: ''
}

const reducer = (state = initialState, action) => {
    switch(action.type) {
        case FETCH_TRANSACTIONS_REQUEST:
            return {
                ...state,
                loading: true
            }
        case FETCH_TRANSACTIONS_SUCCESS:
            return {
                loading: false,
                transactions: action.payload,
                error: ''
            }
        case FETCH_TRANSACTIONS_FAILURE:
            return {
                loading: false,
                transactions: [],
                error: action.payload
            }
        default:
            return state
    }
}

export default reducer
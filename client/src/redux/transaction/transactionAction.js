import {
    FETCH_TRANSACTIONS_FAILURE,
    FETCH_TRANSACTIONS_SUCCESS,
    FETCH_TRANSACTIONS_REQUEST
} from './transactionTypes'
import axios from 'axios'

const url = `http://localhost:3000/addresses/0xF7b547f3E46EFfB3480EEE2c486AE760734B135c/transactions`

export const fetchTransactions = () => {
    return (dispatch) => {
        dispatch(fetchTransactionsRequest)
        axios.get(url)
            .then(response => {
                const transactions = response.data
                dispatch(fetchTransactionsSuccess(transactions))
            })
            .catch(error => {
                const errorMessage = error.message
                dispatch(fetchTransactionsFailure(errorMessage))
            })
    }
}

export const fetchTransactionsRequest = () => {
    return {
        type: FETCH_TRANSACTIONS_REQUEST
    }
}

export const fetchTransactionsSuccess = (transactions) => {
    return {
        type: FETCH_TRANSACTIONS_SUCCESS,
        payload: transactions
    }
}

export const fetchTransactionsFailure = (error) => {
    return {
        type: FETCH_TRANSACTIONS_FAILURE,
        payload: error
    }
}
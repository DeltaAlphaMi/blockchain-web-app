import React, { useEffect } from 'react'
import { Table } from 'react-bootstrap'
import { connect } from 'react-redux'
import { fetchTransactions } from '../redux'

function TransactionContainer({ transactionData, fetchTransactions }) {
    useEffect(() => {
        fetchTransactions()
    }, [])
    return transactionData.loading ? (
        <h2>Loading</h2>
    ) : transactionData.error ? (
        <h2>{transactionData.error}</h2>
    ) : (
        <div>
            <h2>List of Transactions</h2>
            <Table bordered hover>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Quantity</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        transactionData &&
                        transactionData.transactions &&
                        transactionData.transactions.map((transaction, index) =>
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{transaction.from}</td>
                                <td>{transaction.to}</td>
                                <td>{transaction.value}</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </div>
    )
}

const mapStateToProps = state => {
    return {
        transactionData: state.transaction
    }
}

const mapDispatchToProps = dispatch => {
    return {
        fetchTransactions: () => dispatch(fetchTransactions())
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TransactionContainer)

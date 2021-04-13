/**
 * This is a KoaJS Restful API with a single endpoint.
 * This API uses web3.js library to load the transaction data from the Blockchain
 * and sends them to the client.
 */

const Koa = require('koa')
const Router = require('koa-router')
const cors = require('@koa/cors')
const Web3 = require('web3')
//  Kovan is a testnet
const web3 = new Web3('https://kovan.infura.io/v3/3269c013c5b2449aaea1bb593f873d77')

const app = new Koa()
const router = new Router()

//  Contract address and its ABI
const contractAddress = '0xf019a9c291fab47003588fe74d33660cd467fc22'
const contractAbi = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getController", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_newController", "type": "address" }], "name": "changeController", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "mint", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_unlockTime", "type": "uint256" }], "name": "changeUnlockTime", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getUnlockTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "allowPrecirculation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "_addr", "type": "address" }], "name": "isPrecirculationAllowed", "outputs": [{ "name": "", "type": "bool" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [{ "name": "_to", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "success", "type": "bool" }], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [{ "name": "_addr", "type": "address" }], "name": "disallowPrecirculation", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "remaining", "type": "uint256" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "controller", "outputs": [{ "name": "", "type": "address" }], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [{ "name": "_unlockTime", "type": "uint256" }], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_to", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Approval", "type": "event" }] //   ERC20 ABI codes

//  Creating an instance of the ERC20 Token Contract
const contract = new web3.eth.Contract(contractAbi, contractAddress)

router.get('/', async ctx => {
    const name = await contract.methods.name().call()
    const symbol = await contract.methods.symbol().call()
    const decimals = await contract.methods.decimals().call()
    const tokenInfo = {
        tokenName: name, 
        tokenSymbol: symbol, 
        tokenDecimals: decimals
    }
    ctx.body = tokenInfo
})

router.get('/addresses/:ethAccount/transactions', async ctx => {
    transactionsTo = []
    transactionsFrom = []
    transactions = []

    let ethAccount = await ctx.params.ethAccount

    //  Fetching the transfers to ethAccount and stores them to the transactionsTo array
    await contract.getPastEvents('Transfer', { filter: { _to: ethAccount }, fromBlock: 'genesis', toBlock: 'latest' }, (err, events) => {
        for (i = 0; i < events.length; i++) {
            transactionsTo[i] = {
                from: events[i].returnValues._from,
                to: events[i].returnValues._to,
                value: web3.utils.fromWei(events[i].returnValues._value, 'ether')
            }
        }
    })

    //  Fetching the transfers from ethAccount and stores them to the transactionsFrom array
    await contract.getPastEvents('Transfer', { filter: { _from: ethAccount }, fromBlock: 'genesis', toBlock: 'latest' }, (err, events) => {
        for (i = 0; i < events.length; i++) {
            transactionsFrom[i] = {
                from: events[i].returnValues._from,
                to: events[i].returnValues._to,
                value: web3.utils.fromWei(events[i].returnValues._value, 'ether')
            }
        }
    })

    //  Storing all the transactions in a single transactions array
    transactions = [...transactionsTo, ...transactionsFrom]
    ctx.body = transactions
})

app.use(cors())
app.use(router.routes()).use(router.allowedMethods())
app.listen(3000)
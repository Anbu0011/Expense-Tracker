const bodyParser = require('body-parser')
const express = require('express')
const mongoose = require('mongoose')
const { Expense } = require('./schema.js')
/** 
 * Expense Tracker
 * 
 * Adding a new expense -> /add-expense
 * post : expenses details
 * 
 * displaying existing records -> /get-expenses
 * get
 * 
 * delete an expense -> /delete-expense
 * delete : id of the entry
 * 
 * updating an existing an one -> update-expense
 * post : id of the entry, expenses details
*/

/**
 * Database Schema
 * amount, category, date
 */

/**
 * 200 - ok
 * 201 - created
 * 401 - unauthorized
 * 404 - page not found
 * 500 - internal server error
 */

const app = express()
app.use(bodyParser.json())

async function connectToDb() {
    try {
        await mongoose.connect('mongodb+srv://test:test@cluster0.4igf4wa.mongodb.net/expenseDB?retryWrites=true&w=majority&appName=Cluster0')
        console.log('DB connection established ;)')
        app.listen(8000, function() {
            console.log('Listening on port 8000...')
        })
    } catch(error) {
        console.log(error)
        console.log('Cloudn\'t establish connection :(')
    }
}
connectToDb()

app.post('/add-expense', async function(request, response) {
    try {
        await Expense.create({
            "amount" : request.body.amount,
            "category" : request.body.category,
            "date" : request.body.date
        })
        response.status(201).json({
            "status" : "success",
            "message" : "entry created"
        })
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "entry not created",
            "error" : error
        })
    }
})

// delete request
app.delete('/delete-expense/:id', async function(request, response) {
    try {
        const expenseEntry = await Expense.findById(request.params.id)
        if(expenseEntry) {
            await Expense.findByIdAndDelete(request.params.id)
            response.status(200).json({
                "status" : "success",
                "message" : "entry deleted"
            })
        } else {
            response.status(404).json({
                "status" : "failure",
                "message" : "entry not found"
            })
        }
    } catch(error) {
        response.status(500).json({
            "status" : "failure",
            "message" : "could not delete entry",
            "error" : error
        })
    }
})
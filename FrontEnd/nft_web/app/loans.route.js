

const express = require('express');
const loanRoutes = express.Router();

// Require Business model in our routes module
let Loan = require('./loans.model.js');

loanRoutes.get('/', async (req, res) => {
    try {
        const loans = await Loan.find({})
        res.json(loans);
    
    } catch (e) {
        res.status(500).send(e);
    }
});

loanRoutes.get('/:loanId', async (req, res) => {
    try {
        const loan = await Loan.findOne({loanId: req.params.loanId});
        res.json(loan);
        
    } catch (e) {
        res.status(500).send(e);
    }
});

loanRoutes.get('/notify/:borrower', async (req, res) => {
    try {
        const loans = await Loan.find({borrower: req.params.borrower, inform: true, onClick: false, liquidate: false, state : 2});
        res.json(loans);
    } catch (error) {
        res.status(500).send(e);
    }
})

loanRoutes.patch('/:loanId', async (req, res) => {
    try {
        const loan = await Loan.findOne({loanId: req.params.loanId});
        loan.onClick = req.body.onClick;
        await loan.save();
        res.json(loan);

    } catch (e) {
        res.status(400).send(e);
    }
});

module.exports = loanRoutes;
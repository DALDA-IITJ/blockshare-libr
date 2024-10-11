import express from 'express';
import { registerNode, submitTxn, checkBalanceByAdd, getState } from '../controllers/blockchainController.js';

const router = express.Router();

// Route for registering as new Node
router.post('/contribute', registerNode);

// Route for submitting transactions
router.post('/submit-txn', submitTxn);

// Route for checking balance
router.get('/balance/:address', checkBalanceByAdd);

// Route for getting Blockchain state
router.get('/balance', getState);


export default router;
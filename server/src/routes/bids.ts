import { Router } from 'express';

const router = Router()


router.get('/', (req, res) => {
    console.log('Fetch bids request received');
    // Example data returned
    const bids = [
        { id: 1, amount: 100, bidder: 'Alice' },
        { id: 2, amount: 150, bidder: 'Bob' }
    ];
    res.status(200).json(bids);
});

export default router;

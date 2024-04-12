import { Router } from 'express';

const router = Router()

router.post('/', (req, res) => {
    console.log('Deploy request received:', req.body);
    res.status(201).send('Deployment initiated successfully');
});

export default router;

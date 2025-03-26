// Updated toolRoutes.ts using ES module syntax
import { Router } from 'express'
import { getTools, createTool } from '../controllers/toolController.js'

const router = Router()

router.get('/', getTools)
router.post('/', createTool)

export default router

import { Router } from "express";
import cartModel from "../models/cart.models.js"
import mongoose from "mongoose"

const router = Router()

// obtener products

router.get('/:cartId', async(req, res) => {
    try{
        const cartId = req.params.cartId
        const product = await cartModel.findById(req.params.cartId).lean().exec()
        res.render('one', {product})
    } catch(error){
        res.render('error',{error:'Error al buscar el product'})
    }
})

// Formulario crear products
router.get('/create', async(req, res) => {
    res.render('create',{})
})

// Post crear products
router.post('/', async(req, res) => {
    try{
        const productNew = req.body
        const result =cartModel.create(productNew)
        res.redirect('/product')
    } catch(error){
        res.render('error',{error:'Error al crear el product'})
    }
    
})

// Buscar un product por nombre
router.put('/:cartId', async(req, res) => {
    try{
        const cartId = req.params.cartId
        await cartModel.findByIdAndUpdate(req.params.cartId, req.body, { new: true })
        return res.json({status:'success'})
    } catch(error){
        res.status(500).json(error)
    }
    
})

// Borrar un product por nombre
router.delete('/:cartId', async(req, res) => {
    try{
        const cart = await cartModel.findById(cartId)
        cart.id = []
        await cart.save()
        return res.json({status:'success'})
    } catch(error){
        res.status(500).json(error)
    }
})

export default router
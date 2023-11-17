import { Router } from "express";
import prdModel from "../models/prd.models.js"
import mongoose from "mongoose"

const router = Router()

// obtener products
router.get('/', async(req, res) => {
    const products = await prdModel.find().lean().exec()
    res.render('list', {products})
})

router.get('/:id', async(req, res) => {
    try{
        const id = req.params.id
        const product = await prdModel.findById(req.params.id).lean().exec()
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
        const result =prdModel.create(productNew)
        res.redirect('/product')
    } catch(error){
        res.render('error',{error:'Error al crear el product'})
    }
    
})

// Buscar un product por nombre
router.put('/:id', async(req, res) => {
    try{
        const id = req.params.id
        await prdModel.findByIdAndUpdate(req.params.id, req.body, { new: true })
        return res.json({status:'success'})
    } catch(error){
        res.status(500).json(error)
    }
    
})

// Borrar un product por nombre
router.delete('/:id', async(req, res) => {
    try{
        const id = req.params.id
        await prdModel.deleteOne({_id:id})
        return res.json({status:'success'})
    } catch(error){
        res.status(500).json(error)
    }
})

export default router
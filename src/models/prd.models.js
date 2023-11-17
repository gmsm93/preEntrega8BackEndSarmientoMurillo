import mongoose from "mongoose"

const mongoosePaginate = require('mongoose-paginate-v2')
const prdCollection = 'products'

const prdSchema = new mongoose.Schema({
    id:{type:String, unique:true},
    title:{type:String},
    description:{type:String},
    code:{type:String},
    price:{type:Number},
    status:{type:Boolean},
    stock:{type:Number},
    category:{type:String},
    thumbnails:{type:String}
  })

prdSchema.plugin(mongoosePaginate)

const prdModel = mongoose.model(prdCollection, prdSchema)

export default prdModel
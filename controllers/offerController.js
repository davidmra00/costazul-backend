import Offer from '../models/OfferModel.js';

const getOffers=async (req,res)=>{
  try {
    const offers=await Offer.find();

    res.json({
      ok:true,
      offers
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      ok:false,
      msg:'Error al obtener las ofertas'
    });
  }
}

const createOffer=async (req,res)=>{
  try {
    const offer=new Offer(req.body);
    await offer.save();

    res.json({
      ok:true,
      offer
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      ok:false,
      msg:'Error al crear la oferta'
    });
  }
}

const updateOffer=async (req,res)=>{
  try {
    const {id}=req.params;

    const offer=await Offer.findById(id);

    if(!offer){
      return res.status(404).json({
        ok:false,
        msg:'No existe una oferta con ese id'
      });
    }

    const offerUpdated=await Offer.findByIdAndUpdate(id,req.body,{new:true});

    res.json({
      ok:true,
      offer:offerUpdated
    });   
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok:false,
      msg:'Error al actualizar la oferta'
    });
  }
}

const deleteOffer=async (req,res)=>{
  try {
    const {id}=req.params;

    const offer=await Offer.findById(id);

    if(!offer){
      return res.status(404).json({
        ok:false,
        msg:'No existe una oferta con ese id'
      });
    }

    await Offer.findByIdAndDelete(id);

    res.json({
      ok:true,
    });   
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok:false,
      msg:'Error al eliminar la oferta'
    });
  }
}

const uploadOfferPicture=(req,res)=>{
  try {
    const url=req.protocol+'://'+req.get('host')+'/uploads/offers/'+req.file.filename;
    
    res.json({
      ok:true,
      url
    }); 
  } catch (error) {
    console.log(error);
    res.status(401).json({
      ok:false,
      msg:'Error al subir la imagen'
    });
  }
}

export {
  getOffers,
  createOffer,
  updateOffer,
  deleteOffer,
  uploadOfferPicture
}
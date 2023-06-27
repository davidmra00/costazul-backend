import Travel from '../models/TravelModel.js';
import reservationEmail from '../helpers/reservationEmail.js';

const getTravels=async (req,res)=>{
  try {
    const travels=await Travel.find();

    res.json({
      ok:true,
      travels
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      ok:false,
      msg:'Error al obtener los viajes'
    });
  }
}

const createTravel=async (req,res)=>{
  try {
    const travel=new Travel(req.body);
    await travel.save();

    res.json({
      ok:true,
      travel
    });
  } catch (error) {
    console.log(error);

    res.status(400).json({
      ok:false,
      msg:'Error al crear el viaje'
    });
  }
}

const updateTravel=async (req,res)=>{
  try {
    const {id}=req.params;

    const travel=await Travel.findById(id);

    if(!travel){
      return res.status(404).json({
        ok:false,
        msg:'No existe un viaje con ese id'
      });
    }

    const travelUpdated=await Travel.findByIdAndUpdate(id,req.body,{new:true});

    res.json({
      ok:true,
      travel:travelUpdated
    });   
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok:false,
      msg:'Error al actualizar el evento'
    });
  }
}

const deleteTravel=async (req,res)=>{
  try {
    const {id}=req.params;

    const travel=await Travel.findById(id);

    if(!travel){
      return res.status(404).json({
        ok:false,
        msg:'No existe un viaje con ese id'
      });
    }

    await Travel.findByIdAndDelete(id);

    res.json({
      ok:true,
    });   
  } catch (error) {
    console.log(error);

    res.status(500).json({
      ok:false,
      msg:'Error al eliminar el viaje'
    });
  }
}

const uploadTravelPicture=(req,res)=>{
  try {
    const url=req.protocol+'://'+req.get('host')+'/uploads/travels/'+req.file.filename;
    
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

const travelReservationEmail=(req,res)=>{
  const {nombre,destino,precio,personas,telefono,correo,comentario}=req.body;
  reservationEmail(nombre,destino,precio,personas,telefono,correo,comentario);

  res.json({
    ok:true
  });
}

export {
  getTravels,
  createTravel,
  updateTravel,
  deleteTravel,
  uploadTravelPicture,
  travelReservationEmail
}
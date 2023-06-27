import fs from 'fs';
import path from 'path';
import User from '../models/UserModel.js';
import Travel from '../models/TravelModel.js';
import Offer from '../models/OfferModel.js';

export const cleanPhotoFiles=async ()=>{
  const users=await User.find();
  const profilePictures=[];
  users.map(user=>profilePictures.push(user.fotoUrl?.split('/').pop()));
  const profilePhotos=profilePictures.filter(Boolean);
  cleanPhotos(profilePhotos,'uploads/profiles');

  const travels=await Travel.find();
  const travelPictures=[];
  travels.map(travel=>travelPictures.push(travel.fotoUrl));
  const travelPhotos=[].concat(...travelPictures);
  const travelPhotosFiles=[];
  travelPhotos.map(photo=>travelPhotosFiles.push(photo.split('/').pop()));
  cleanPhotos(travelPhotosFiles,'uploads/travels');

  const offers=await Offer.find();
  const offerPictures=[];
  offers.map(offer=>offerPictures.push(offer.fotoUrl));
  const offerPhotos=[].concat(...offerPictures);
  const offerPhotosFiles=[];
  offerPhotos.map(photo=>offerPhotosFiles.push(photo.split('/').pop()));
  cleanPhotos(offerPhotosFiles,'uploads/offers');
}

const cleanPhotos=(arrayFiles,rute)=>{
  const pathFolder = path.join(rute);
  
  fs.readdir(pathFolder, (error, files) => {
    if (error) {
      console.error(error);
      return;
    }
  
    files.forEach(file => {
      const pathFile = path.join(pathFolder, file);
      if (!arrayFiles.includes(file)) {
        fs.unlink(pathFile, error => {
          if (error) {
            console.error(error);
            return;
          }
          //console.log(`Archivo ${file} eliminado.`);
        });
      }
    });
  });
}

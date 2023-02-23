const ApiError = require("../api-error");
const ContactService = require("../services/contact.services");
const MongoDB = require("../utils/mongodb.util")

exports.create = async (req,res,next) => {
    if(!req.body?.name){
        return next(new ApiError(400, "Name cannot be empty"));
    }

    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.create(req.body);
        return res.send(document); 
    }
    catch (error){
        return next(new ApiError(500, "An error occurred while creating the contact"));
    }
};

exports.findAll = async (req, res, next) => {
    let documents = [];

    try{
        const contactService = new ContactService(MongoDB.client);
        const { name } = req.body;
        if(name){
            documents = await contactService.findByName(name);
        }
        else documents = await contactService.find({});
    }
    catch (error){
        return next(new ApiError(500, "An error occurred while retrieving contacts"));
    }

    return res.send(documents);
};

exports.findOne = async (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.findById(req.params.id);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send(document);
    }
    catch (error){
        return next(new ApiError(500, "Error retrieving contact with id = " + req.params.id));
    }
};


exports.update = async (req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.update(req.params.id, req.body);
        if(!document){
            return next(new ApiError(404, "Contact not found"));
        }
        return res.send({message: "Contact was updated succesfully"});
    }
    catch (error){
        return next(new ApiError(500, `Error updating contact with id = ${req.params.id}`));
    }
};

exports.delete = async (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const document = await contactService.delete(req.params.id);
        if(!document) 
            return next(new ApiError(404, "Contact not found"));
        return res.send({message: "Contact was deleted succesfully"});
    }
    catch (error){
        return next(new ApiError(500, `Error deleting contact with id = ${req.params.id}`));
    }
};

exports.findAllFavorite = async (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const documents = await contactService.findAllFavorite();
        return res.send(documents)
    }
    catch (error){
        return next(new ApiError(500,"An error occurred while retrieving favorite contacts"));
    }
};

exports.deleteAll = async (req, res, next) => {
    try{
        const contactService = new ContactService(MongoDB.client);
        const deleteCount = await contactService.deleteAll();
        return res.send({message: `${deleteCount} contacts were deleted successfully`})        
    }
    catch (error){
        return next(new ApiError(500, "An error occurred while deleting all contacts"))
    }
};

exports.updateAll = async (req, res, next) => {
    if(Object.keys(req.body).length === 0){
        return next(new ApiError(400, "Data to update can not be empty"));
    }

    try{
        const contactService = new ContactService(MongoDB.client);
        const updateCount  = await contactService.updateAll(req.body);
        return res.send({message: `${updateCount} contacts were updated successfully`})
    }
    catch(error) {
        console.log(error)
        return next(new ApiError(500, "An error occurred while updating all contacts"))
    }
};
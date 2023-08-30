import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    firstName: {
        type: String, 
       
        
    }, 

    lastName: {
        type: String, 
        
    },

    email:{
        type: String,
        require: true,
        unique: true
    },

    password: {
        type: String, 
        
    },    

    hasAllData: {
        type: Boolean, 
        default: false,
        
    },                                                    

    cellNumber: {
        type: Number, 
       
    },
    
    dateOfBirth: Date,                                      // confirmar ya que en web pide que tenga mas de 18 años     
    
    verificationCode: {
         type: String
    },
    
    emailStatus: { 
        type: String,
        default: "UNVERIFIED" 
    },                                                      // para devolver al verificar el code
            
    nationality: {
        type: String,
    }
}, /* {
    timestamps:true
} */)

export default model("User", userSchema);


const { default: mongoose } = require("mongoose")

const dbConnect=()=>{
     
    
     try{
         
    
        mongoose.connect(process.env.MONGODB_URL);
        const connection = mongoose.connection;

        connection.once("open", () => {

         console.log("Monodb Connection success!");

       });
        


     }catch(error){

        console.log(`DataBase Error`);

     }
   


}
module.exports=dbConnect;
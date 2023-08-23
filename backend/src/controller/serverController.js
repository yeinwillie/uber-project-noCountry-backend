const server = async (req , res) =>{
    try {
        res.send('Hola Frontend');
      } catch (error) {
        res.status(404).send(error);
      }       
    
};

export default server;

module.exports = (func) => {
    return (req,res,next)=>{
        //reference to next is provided in catch block which is only executed if the control moves to the catch due to an error
        func(req,res,next).catch(next);
    }
};


//catchAsync will accept a function as an argument, This will then be exexuted with a catch method attached to it 
//inside the return value 

//The return value is middleware because it takes in req, res, and next as arguments, 
//which are the standard parameters for middleware in Express.
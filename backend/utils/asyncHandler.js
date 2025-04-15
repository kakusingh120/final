const asyncHandler=(Asynchandler)=>{
    return (req,res,next)=>{
      Promise.resolve(Asynchandler(req,res,next)).catch((error)=>(next(error)))
    }
  }
  export default asyncHandler;
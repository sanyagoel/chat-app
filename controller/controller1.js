


const getHome = (req,res,next)=>{
    res.render('homes');
}

const postHome = (req,res,next)=>{
    const name = req.body.username;
    console.log(name);
    res.render('index' , {username : name});
}


module.exports = {
    home : getHome,
    posth : postHome
}


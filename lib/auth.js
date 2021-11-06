const auth = {
  IsOwner: function (req, res) {
    if (req.session.is_logined) {
      return true;
    } else {
      return false;
    }
  },
  StatusUI:function(req,res){
    let authStatusUI = '<a class="btn-style home-btn-style" href="/auth/login">login</a>'
    if(this.IsOwner(req,res)){
      authStatusUI = `<span>${req.session.nickname} | </span><a class="btn-style home-btn-style" href="/auth/logout">logout</a>`;
    }
    return authStatusUI;
  }
};
module.exports = auth;
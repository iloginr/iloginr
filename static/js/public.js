var iloginr = {"version": "1.0"};

iloginr.Box = function(context){
  this.initialize(context);
};

iloginr.Box.prototype = {
  initialize: function(context){
    var self = this;
    self.context = context;
    self.service = $('#service', self.context);
    self.passwd = $('#password', self.context);
    self.form = $('form', self.context);
    self.button = $('input[type=submit]', self.context);
    self.output = $('.results', self.context).hide();

    self.form.submit(function(){
      self.submit();
      return false;
    });
  },

  submit: function(){
    var self = this;
    var passwd = sha256_digest(self.service.val() + ":" + self.passwd.val());
    passwd = passwd.slice(55, 64);
    self.output.html(passwd).show();
  }
};

$(document).ready(function() {
  var iBox = new iloginr.Box($('.content'));
});

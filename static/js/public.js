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
    self.advanced = self.context.find('#advanced');
    self.appVersion = self.context.find('#appVersion');
    self.caps = self.context.find('#caps');
    self.numbers = self.context.find('#numbers');
    self.special = self.context.find('#special');
    self.pwdLength = self.context.find('#length');
    self.pwdVersion = self.context.find('#version');

    self.advanced.click(function(){
      return self.advancedOptions();
    });

    self.form.submit(function(evt){
      evt.preventDefault();
      if(self.appVersion.val() != '2'){
        self.submit();
      }else{
        self.submit2();
      }
      return false;
    });
  },

  submit: function(){
    var self = this;
    var passwd = self.service.val() + ":" + self.passwd.val();
    passwd = new jsSHA(passwd, "TEXT");
    passwd = passwd.getHash("SHA-256", "HEX");
    passwd = passwd.slice(55, 64);
    self.output.html(passwd).show();
  },

  submit2: function(){
    var self = this;
    var version = parseInt(self.pwdVersion.val(), 10);
    var passwd = self.service.val() + ':' + self.passwd.val() + ':' + version;
    passwd = new jsSHA(passwd, "TEXT");
    passwd = passwd.getHash("SHA-512", "HEX");
    self.output.html(passwd).show();

    var newpwd = [];
    var length = parseInt(self.pwdLength.val(), 10);
    for(var idx=0; idx<length; idx++){
      var stop = length / 128;
      var start = idx * stop;
      var end  = idx * stop + stop;
      var chunk = passwd.slice(start, end);
      if(!chunk.length){
        break;
      }
    }
  },

  advancedOptions: function(){
    var self = this;
    self.context.find('div.advanced').slideToggle();
  }
};

$(document).ready(function() {
  var iBox = new iloginr.Box($('.content'));
});

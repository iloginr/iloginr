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
      if(self.appVersion.val() == '1'){
        self.submit();
      }else{
        self.submit3();
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
    self.output.find('.acValue').html(passwd)
    self.output.show();
  },

  submit3: function(){
    var self = this;
    var version = parseInt(self.pwdVersion.val(), 10);
    var passwd = self.service.val().trim() + ':' + self.passwd.val().trim() + ':' + version;

    passwd = new jsSHA(passwd, "TEXT");
    passwd = passwd.getHash("SHA-512", "HEX");

    var newpwd = [];
    var length = parseInt(self.pwdLength.val(), 10);
    for(var idx=0; idx<length; idx++){
      var stop = Math.floor(128 / length);
      var start = idx * stop;
      var end  = idx * stop + stop;
      var chunk = passwd.slice(start, end);
      if(!chunk.length){
        break;
      }

      var number = 0;
      var numbers = chunk.match(/\d+/g) || [];
      numbers = $.map(numbers, function(nr){
        nr = parseInt(nr, 10);
        number += nr;
        return nr;
      });

      var letters;
      if(self.appVersion.val() == '2'){
        letters = chunk.match(/[a-z]]/g) || [];
      }else{
        letters = chunk.match(/[a-z]/g) || [];
      }

      letters = $.map(letters, function(letter){
        letter = letter.charCodeAt();
        number += letter;
        return letter;
      });

      var letter;
      if( (idx+1) % 4 === 0 && self.numbers.is(':checked') ){
        letter = number % 10;
        if(letter === 0 || letter === 1){
          letter = 9;
        }
      }else if( (idx+1) % 5 === 0 && self.caps.is(':checked') ){
        letter = number % 25 + 97;
        letter = String.fromCharCode(letter);
        letter = letter.toUpperCase();
        if(letter == "L"){
          letter = "M";
        }else if(letter == "O"){
          letter = "U";
        }
      }else if( (idx+1) % 7 === 0 && self.special.is(":checked") ){
        letter = number % 14 + 33;
        letter = String.fromCharCode(letter);
      }else{
        letter = number % 25 + 97;
        letter = String.fromCharCode(letter);
        if(letter == "l"){
          letter = "k";
        }
      }

      newpwd.push(letter.toString());
    }

    var nextpwd = [];
    jQuery.each(newpwd, function(idx, letter){
      if( idx && (idx) % 4 === 0 ){
        nextpwd.push('|');
      }
      nextpwd.push(letter);
    });

    nextpwd = nextpwd.join("").split('|');

    var html = jQuery('<div>');
    jQuery.each(nextpwd, function(idx, chunk){
      var span = jQuery('<span>')
        .addClass('acFragment')
        .text(chunk)
        .appendTo(html);
    });

    self.output.find('.acValue').html(html);
    self.output.show();
  },

  advancedOptions: function(){
    var self = this;
    self.context.find('div.advanced').slideToggle();
  }
};

$(document).ready(function() {
  var iBox = new iloginr.Box($('.content'));
});

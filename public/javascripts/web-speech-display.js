AFRAME.registerComponent('web-speech-display', {
    schema: {
      lang: {type: 'string', default: 'en'},
      interimResults: {type: 'boolean', default: true},
      timeout: {type: 'number', default: 5}
    },
  
    init: function () {
      easyrtc.enableMicrophone(false);
      let data = this.data;
      var isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);
      if (isChrome) {
        this.recognizer = new webkitSpeechRecognition();
      } else {
        this.recognizer = new SpeechRecognition();
      }
      
      this.recognizer.continuous = true;
      this.recognizer.interimResults = data.interimResults;
      this.recognizer.lang = data.lang;
      console.log('init');
      this.onresult = this.displayResult;
      this.onend = this.start;
      this.recognizer.onresult = (event) => {
        this.onresult(event);
      };
      this.recognizer.onend = ()=>{this.onend();};
      this.recognizer.start();
    },
  
    update: function(previousData) {
      if(!previousData) return;
      if (previousData.lang !== this.data.lang) {
        console.log(previousData.lang);
        this.recognizer.lang = this.data.lang;
        this.recognizer.stop();
      }
      if (previousData.interimResults !== this.data.interimResults) {
        console.log(previousData.interimResults);
        this.recognizer.interimResults = this.data.interimResults;
        this.recognizer.stop();
      }
    },

    remove: function() {
      this.recognizer.stop()
    },

    start: function() {
      console.log('Begin Speaking');
      this.recognizer.start();
    },

    displayResult: function(event) {
      console.log('displayresults');

      if (event.results.length > 0) {
          var result = event.results[event.results.length-1];
          this.el.setAttribute('text', {value: result[0].transcript});
          if (this.timeout) {
            clearTimeout(this.timeout);
          }
          this.timeout = setTimeout(()=>{
            this.el.setAttribute('text', {value: ''});
          }, this.data.timeout * 1000);
      }
    }
  });
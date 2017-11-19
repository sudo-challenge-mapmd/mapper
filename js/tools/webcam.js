var Webcam = (function() {

    const constraints = {
        advanced: [{
            facingMode: "environment"
        }]
    };

	navigator.getMedia = ( navigator.getUserMedia ||
							navigator.webkitGetUserMedia ||
							navigator.mozGetUserMedia ||
							navigator.msGetUserMedia);
	function Webcam()
	{
		this.onReady = new tools.Signal();
		this.onError = new tools.Signal();
		this.isReady = false;
		this.video = document.createElement("video");
		this.width, this.height, this.ratio;
		this.stream;
	}

	Webcam.isAvailable = Boolean(navigator.getMedia);
	
	Webcam.prototype = {
		
		init : function()
		{
			if(!Webcam.isAvailable)return;
			navigator.getMedia({video: constraints},
			this._onSuccess.bind(this), this._onError.bind(this));

		},

		
		_onSuccess : function(stream)
		{
			this.stream = stream;
			if (navigator.mozGetUserMedia) this.video.mozSrcObject = stream;
			else
			{
				var vendorURL = window.URL || window.webkitURL;
				this.video.src = vendorURL.createObjectURL(stream);
			}
			this.video.addEventListener('canplay', this._canPlay.bind(this), false);
			this.video.play();
		},


		_canPlay : function(event)
		{
			if (this.isReady) return;
			this._checkSize();
		},

		
		_onReady : function(event)
		{
			this.isReady = true;
			this.onReady.dispatch();
		},


		_checkSize : function()
		{
			if(this.video.videoWidth)
			{
				this.video.width = this.video.videoWidth;
				this.video.height = this.video.videoHeight;
				this._onReady();
			}
			else setTimeout(this._checkSize.bind(this), 0);//la taille est dispo à un moment inconnu
		},

		
		_onError : function(error)
		{
			this.onError.dispatch(error);
		},


		stop : function()
		{
			this.stream.stop();
		}
	}

	return Webcam;
})();

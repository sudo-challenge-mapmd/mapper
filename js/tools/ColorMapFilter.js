/**
 * @author Mat Groves http://matgroves.com/ @Doormat23
 * @author Grégoire Divaret http://grgrdvrt.com/ @grgrdvrt
 */
 
/**
 *
 * The ColorMapFilter class uses the pixel values from the specified texture to map the colors of un object
 * @class ColorMapFilter
 * @contructor
 * @param texture {Texture} The texture used for the color map * must be power of 2 texture at the moment
 */
PIXI.ColorMapFilter = function(texture)
{
    PIXI.AbstractFilter.call( this );
 
    this.passes = [this];
    texture.baseTexture._powerOf2 = true;
 
    // set the uniforms
    this.uniforms = {
        palette: {type: 'sampler2D', value:texture},
        timeOffset:   {type: '1f', value:0},
        mapDimensions:   {type: '2f', value:{x:0xff, y:1}},
        dimensions:   {type: '4fv', value:[0,0,0,0]}
    };
 
    if(texture.baseTexture.hasLoaded)
    {
        this.uniforms.palette.value.x = texture.width;
        this.uniforms.palette.value.y = texture.height;
    }
    else
    {
        this.boundLoadedFunction = this.onTextureLoaded.bind(this);
 
        texture.baseTexture.on('loaded', this.boundLoadedFunction);
    }
 
    this.fragmentSrc = [
        'precision mediump float;',
        'uniform sampler2D palette;',
        'uniform float timeOffset;',
        'varying vec2 vTextureCoord;',
        'uniform sampler2D uSampler;',
 
        'void main(void) {',
        '   vec4 origColor = texture2D(uSampler, vTextureCoord);',
        '   vec2 mapCoords = vec2(mod(origColor.r + timeOffset / 255.0 + 1.0, 0.9) + 0.05, 0.0);',
        '   vec4 colorValue =  texture2D(palette, mapCoords);',
        '   gl_FragColor = colorValue;',
        '}'
    ];
};
 
PIXI.ColorMapFilter.prototype = Object.create( PIXI.AbstractFilter.prototype );
PIXI.ColorMapFilter.prototype.constructor = PIXI.ColorMapFilter;
 
PIXI.ColorMapFilter.prototype.onTextureLoaded = function()
{
    this.uniforms.mapDimensions.value.x = this.uniforms.palette.value.width;
    this.uniforms.mapDimensions.value.y = this.uniforms.palette.value.height;
 
    this.uniforms.palette.value.baseTexture.off('loaded', this.boundLoadedFunction);
};
 
/**
 * The texture used for the color map * must be power of 2 texture at the moment
 *
 * @property palette
 * @type Texture
 */
Object.defineProperty(PIXI.ColorMapFilter.prototype, 'palette', {
    get: function() {
        return this.uniforms.palette.value;
    },
    set: function(value) {
        this.uniforms.palette.value = value;
    }
});

Object.defineProperty(PIXI.ColorMapFilter.prototype, 'timeOffset', {
    get: function() {
        return this.uniforms.timeOffset.value;
    },
    set: function(value) {
        this.uniforms.timeOffset.value = value;
    }
});
 
class VisionMapFilter extends PIXI.Filter {
    constructor(rInner = 0.1, rOuter = 0.2, center = {x:0.5, y:0.5}) {
        super(VisionMapFilter.vertexShader, VisionMapFilter.fragmentShader);
        this.uniforms.nssm = new PIXI.Matrix();
        this.uniforms.inssm = new PIXI.Matrix();

        this.uniforms.rInner = rInner;
        this.uniforms.rOuter = rOuter;
        this.uniforms.center = center;
        this.uniforms.warp = 1;
        this.uniforms.darkening = 1;
        this.uniforms.contrast = 0;
    }
    apply(filterManager, input, output) {
        filterManager.calculateNormalizedScreenSpaceMatrix(this.uniforms.nssm);
        filterManager.calculateNormalizedScreenSpaceMatrix(this.uniforms.inssm);
        this.uniforms.inssm.invert();

        filterManager.applyFilter(this, input, output);
    }
}
VisionMapFilter.vertexShader = `
        attribute vec2 aVertexPosition;
        attribute vec2 aTextureCoord;
        uniform mat3 projectionMatrix;
        uniform mat3 filterMatrix;
        varying vec2 vTextureCoord;
        varying vec2 vFilterCoord;
        void main(void){
           gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);
           vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0) ).xy;
           vTextureCoord = vFilterCoord;
        }
    `;
VisionMapFilter.fragmentShader = `
        precision highp float;

        varying vec2 vTextureCoord;
        uniform sampler2D uSampler;

        uniform mat3 nssm;
        uniform mat3 inssm;

        uniform float rInner;
        uniform float rOuter;
        uniform vec2 center;
        uniform float warp;
        uniform float darkening;
        uniform float contrast;

        vec2 mapCoord( vec2 coord ){
            return (vec3(coord, 1.0) * nssm).xy;
        }

        vec2 unmapCoord( vec2 coord ){
            return (vec3(coord, 1.0) * inssm).xy;
        }

        vec2 warpAround(vec2 uv, vec2 p, float rInner, float rOuter) {
            vec2 d = p - uv;
            float l = length(d);
            vec2 n = normalize(d);
            float r = rInner;
            float R = rOuter;
            float x = 1.0 - clamp((l - r)/(R - r), 0.0, 1.0);
            float m = x;

            return n * m * l;
        }

        vec2 warpInner(vec2 uv, vec2 p, float rInner) {
            vec2 d = p - uv;
            float l = length(d);
            vec2 n = normalize(d);
            float r = rInner;
            float x = clamp((r - l)/r, 0.0, 1.0);
            return n * x * x * l;
        }

        vec3 brightnessContrast(vec3 value, float brightness, float contrast){
            return (value - 0.5) * contrast + 0.5 + brightness;
        }

        vec3 enhance(vec3 col, vec2 uv, vec2 p, float rInner, float rOuter){
            vec2 d = p - uv;
            float l = length(d);
            float r = rOuter - rInner;
            float R = rOuter;

            float x = max(R - l, 0.0);
            float cm = x;
            return brightnessContrast(col, cm * 2.0, cm * 8.0 + 1.0);
        }

        vec3 darken(vec3 col, vec2 uv, vec2 p, float rInner, float rOuter){
            vec2 d = p - uv;
            float l = length(d);
            float r = rInner;
            float R = rOuter;

            float x = max(r - l, 0.0);
            return brightnessContrast(col, -x*12., 1.0);
        }

        float isolate(float v, float e1, float e2) {
            float c = clamp(v, e1, e2) - e1;
            return step(e1, v) * step(v, e2) * c;
        }

        void main(){
            vec2 uv = mapCoord(vTextureCoord);
            vec2 uv0 = uv;

            vec2 delta = vec2(0.0);
            delta += warpAround(uv, center, rInner, rOuter);
            uv += delta * warp;

            // uv += warpInner(uv, center, rInner);

            vec3 col = texture2D(uSampler, unmapCoord(uv)).rgb;
            vec3 e = vec3(0.0);

            // brightness / contrast
            e = col;
            e = enhance(e, uv, vec2(0.5), rInner, rOuter);
            col = mix(col, e, contrast);

            // simulate vision
            e = col;
            e = darken(e, uv0, center, rInner, rOuter);
            col = mix(col, e, darkening);

            gl_FragColor = vec4(col, 1.0);
            // gl_FragColor = vec4(col, 1.0) * 0.5 + vec4(vec3(stage1, stage2, stage3), 1.)*0.5 ;
            // gl_FragColor = vec4(vec3(stage1, stage2, stage3), 1.);
        }
    `;
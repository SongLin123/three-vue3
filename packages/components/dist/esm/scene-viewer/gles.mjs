const html = `        <script id="vertexShader1" type="x-shader/x-vertex">
uniform float height1;
varying float r;

void main()
{
r = (position[1]/2.0+20.0 ) / height1;
gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
<\/script>
<script id="fragmentShader1" type="x-shader/x-fragment">
#ifdef GL_ES
precision mediump float;
#endif

varying float r;

void main(){
vec3 color = vec3(r,r*1.1,r*1.3);

gl_FragColor = vec4(color, 0.95);
}
<\/script>

<script id="vertexShader2" type="x-shader/x-vertex">
uniform float u_time;
uniform float max_radius;
uniform float height1;
uniform float band_width;
varying vec4 color1;

void main()
{
float opacity1 = 0.96;
color1 = vec4(6.0/255.0, 15.0/255.0 , 6.0/255.0,opacity1);

if(normal[1] > 0.9){
color1 = vec4(47.0/255.0, 79.0/255.0 , 79.0/255.0, opacity1);
}

float dist1 = sqrt( position[0]*position[0] + position[2] * position[2] );
float t2 = sin(u_time * .4);
if( t2 >0.0 ){
float absDistCha = abs( t2 * max_radius - dist1 );
if( absDistCha < band_width ){
  float c2 = 0.95  ;
  float c3 = 0.95 * abs(cos( absDistCha / band_width * 3.14 ) ) ;

  color1 = vec4(c2 ,c2, c2 , c3);
}

}  

gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}
<\/script>
<script id="fragmentShader2" type="x-shader/x-fragment">
#ifdef GL_ES
precision mediump float;
#endif

varying vec4 color1;

void main(){

gl_FragColor = color1 ;
}
<\/script>`;

export { html };
//# sourceMappingURL=gles.mjs.map

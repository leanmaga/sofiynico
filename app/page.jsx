'use client';
import {useEffect,useRef,useState} from 'react';
import {boda} from './datos';
import {motion, useMotionValue, useSpring, useReducedMotion} from 'motion/react';

const titulos=['Nos casamos','La cuenta regresiva','Nuestro álbum','Un regalo','La banda sonora','El encuentro','Dress code','Notas','¿Nos acompañás?','Con todo nuestro amor'];
const fotos = [
  ['galeria1.jpg', 'Un abrazo bajo las palmeras'],
  ['galeria2.jpg', 'Juntos en un banco de madera'],
  ['galeria3.jpg', 'Bajo los arcos de la glorieta'],
  ['galeria4.jpg', 'Una mirada junto al lago'],
  ['galeria5.JPG', 'Un abrazo en el jardín'],
  ['galeria6.jpg', 'Una selfie con los cascos puestos'],
  ['galeria7.jpg', 'Los dos en la pantalla de la cámara'],
];
function Atmosfera(){
 return <div className="atmosfera" aria-hidden="true"><div className="paisaje"/><div className="aura"/>{Array.from({length:44},(_,i)=><i key={i} style={{left:((i*73+11)%101)+'%',top:((i*43+7)%97)+'%','--delay':-(i%15)+'s','--dur':(7+i%8)+'s','--size':(i%6===0?4:2)+'px'}}/>)}</div>
}
function Portada({cover,abriendo,abrir}){
 const x=useMotionValue(0),y=useMotionValue(0);
 const rx=useSpring(x,{stiffness:130,damping:18}),ry=useSpring(y,{stiffness:130,damping:18});
 const quieto=useReducedMotion();
 function inclinar(e){
   if(quieto)return;
   const r=e.currentTarget.getBoundingClientRect();
   x.set(5*(.5-(e.clientY-r.top)/r.height));y.set(9*((e.clientX-r.left)/r.width-.5));
 }
 return <motion.div className="relicario" style={{rotateX:rx,rotateY:ry}} onPointerDown={inclinar} onPointerUp={()=>{x.set(0);y.set(0)}} onPointerCancel={()=>{x.set(0);y.set(0)}} onPointerMove={inclinar} onPointerLeave={()=>{x.set(0);y.set(0)}}>
 <button ref={cover} className={'tapa '+(abriendo?'abierta':'')} onClick={abrir} aria-label="Abrir el libro de Sofi y Nico">
 <span className="etiqueta"><span className="etiqueta-nombres">Sofi &amp; Nico</span><span>{boda.fechaCorta}</span><span className="etiqueta-abrir">Abrir el libro →</span></span>
 </button></motion.div>
}function HeroBoda({heading}) {
  const video=useRef(null);
  const [pausado,setPausado]=useState(true);
  return <div className="hero-boda">
    <video ref={video} autoPlay muted loop playsInline preload="auto" poster="/fotos/galeria5.JPG" src="/fotos/video1.mp4" aria-hidden="true" onPlaying={()=>setPausado(false)} onPause={()=>setPausado(true)}/>
    <div className="votos"><span className="monograma" aria-hidden="true">S<i>N</i></span>
      <time dateTime={boda.fecha}>{boda.fechaCorta}</time>
      <h1 ref={heading} tabIndex={-1}>Sofi <i>&amp;</i> Nico</h1>
      <strong>¡Nuestra boda!</strong>
      <p>Te elijo hoy y por el resto de mi vida.</p>
    </div>
    <button className="control-film" aria-label={pausado?'Reproducir video':'Pausar video'} onClick={()=>pausado?video.current.play().catch(()=>setPausado(true)):video.current.pause()}>{pausado?'▷':'Ⅱ'}</button>
  </div>;
}
function Consejos() {
  const dialogo = useRef(null);
  return <>
    <button className="action" aria-haspopup="dialog" onClick={()=>dialogo.current.showModal()}>Tips y Notas</button>
    <dialog className="looks tips" ref={dialogo} aria-label="Tips y Notas" onKeyDown={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()} onTouchEnd={e=>e.stopPropagation()}>
      <div className="looks-bar"><h2>Tips y Notas</h2><button onClick={()=>dialogo.current.close()}>Cerrar ×</button></div>
      <ul><li>¡Por favor ser puntuales!</li><li>Queremos que disfrutes de esta fiesta al máximo, por eso decidimos que sea un evento sólo para adultos.</li><li>¡Confirmar asistencia a la brevedad, antes del X Fecha!</li><li>Llevar abrigo para disfrutar de los espacios exteriores.</li><li>Olvidarse de todo, y ¡¡¡a disfrutar!!!</li></ul>
    </dialog>
  </>;
}
function EjemplosVestimenta() {
  const dialogo = useRef(null);
  return <>
    <button className="action" aria-haspopup="dialog" onClick={() => dialogo.current.showModal()}>Ver ejemplos</button>
    <dialog ref={dialogo} className="looks" aria-label="Ejemplos de elegante sport" onKeyDown={e=>e.stopPropagation()} onTouchStart={e=>e.stopPropagation()} onTouchEnd={e=>e.stopPropagation()}>
      <div className="looks-bar"><span>Elegante sport</span><button autoFocus onClick={() => dialogo.current.close()}>Cerrar ×</button></div>
      <img loading="lazy" width="1024" height="1536" src="/fotos/elegante-sport.webp" alt="Seis looks: blazer azul con pantalón beige, vestido terracota, traje verde salvia, mono bordó, blazer arena con pantalón oscuro y falda floral con blusa marfil."/>
    </dialog>
  </>
}
function Countdown(){const [now,set]=useState(null);useEffect(()=>{set(Date.now());const id=setInterval(()=>set(Date.now()),1000);return()=>clearInterval(id)},[]);const s=Math.max(0,Math.floor((Date.parse(boda.fecha)-(now??Date.parse(boda.fecha)))/1000));return <div className="count">{[Math.floor(s/86400),Math.floor(s/3600)%24,Math.floor(s/60)%60,s%60].map((n,i)=><div key={i}><strong>{now===null?'—':String(n).padStart(2,'0')}</strong><small>{['días','horas','min','seg'][i]}</small></div>)}</div>}
function Formulario({tipo}){const [estado,set]=useState('');async function enviar(e){e.preventDefault();const form=e.currentTarget;set('Enviando…');try{const r=await fetch('/api/respuestas',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({tipo,...Object.fromEntries(new FormData(form))})});if(!r.ok)throw Error();form.reset();set(tipo==='musica'?'¡Anotamos tu canción!':'¡Gracias! Guardamos tu respuesta.')}catch{set('No se pudo guardar. Volvé a intentar.')}}return <form onSubmit={enviar}><label>Tu nombre<input name="nombre" maxLength={200} required/></label>{tipo==='musica'?<label>Canción y artista<input name="detalle" maxLength={200} required/></label>:<label>Tu respuesta<select name="detalle"><option>Voy a estar</option><option>No puedo ir</option></select></label>}<button className="action" disabled={estado==='Enviando…'}>{tipo==='musica'?'Enviar canción':'Confirmar respuesta'}</button><span role="status">{estado}</span></form>}
// Recorta el rectángulo a cada lado de la línea donde se dobla el papel.
function cortar(rect, distancia, lado) {
  const puntos = [];
  rect.forEach((a, i) => {
    const b = rect[(i + 1) % rect.length];
    const da = distancia(a) * lado, db = distancia(b) * lado;
    if (da >= 0) puntos.push(a);
    if ((da > 0 && db < 0) || (da < 0 && db > 0)) {
      const t = da / (da - db);
      puntos.push([a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]);
    }
  });
  return puntos;
}
function poligono(puntos) {
  return puntos.length < 3 ? 'inset(100%)' : 'polygon(' + puntos.map(([x,y]) => x+'px '+y+'px').join(',') + ')';
}
function Pliegue({reverso}) {
  const ref = useRef(null);
  useEffect(() => {
    const dorso = ref.current;
    const hoja = dorso.parentElement.querySelector('.folding');
    const w = hoja.offsetWidth, h = hoja.offsetHeight;
    const rect = [[0,0],[w,0],[w,h],[0,h]];
    const inicio = performance.now();
    let frame;
    function dibujar(ahora) {
      const t = Math.min(1, Math.max(0, (ahora - inicio) / 900));
      const avance = t*t*(3-2*t);
      const angulo = .63 - .43*avance;
      const nx = Math.cos(angulo)*(reverso?-1:1), ny = Math.sin(angulo);
      const origen = (reverso?0:nx*w) + ny*h;
      const linea = origen - avance*(Math.abs(nx)*w + ny*h);
      const distancia = ([x,y]) => nx*x + ny*y - linea;
      hoja.style.clipPath = poligono(cortar(rect, distancia, -1));
      const vuelta = cortar(rect, distancia, 1).map(p => {
        const d = distancia(p);
        return [p[0]-2*d*nx, p[1]-2*d*ny];
      });
      dorso.style.clipPath = poligono(vuelta);
      const sentido = reverso ? 270 + angulo*180/Math.PI : 90 + angulo*180/Math.PI;
      const borde = linea - Math.min(0,nx*w);
      dorso.style.background = 'linear-gradient('+sentido+'deg,#e8dfcd '+(borde-70)+'px,#fff9eb '+(borde-22)+'px,#dacdb4 '+(borde-3)+'px,#bbae95 '+borde+'px)';
      if(t<1) frame=requestAnimationFrame(dibujar);
    }
    dibujar(inicio);
    return () => { cancelAnimationFrame(frame); hoja.style.clipPath=''; };
  }, [reverso]);
  return <div className="fold-back" aria-hidden="true" ref={ref}/>;
}
export default function Home(){const [pagina,set]=useState(-1),[dir,setDir]=useState(1),[foto,setFoto]=useState(0),[copiado,setCopiado]=useState('');const [abriendo,setAbriendo]=useState(false);const heading=useRef(null),cover=useRef(null),opened=useRef(false);
 const [destino, setDestino] = useState(null);
 const timer = useRef(null);
 const gesto = useRef(null);
 useEffect(() => () => clearTimeout(timer.current), []);
 function ir(n) {
   if (timer.current !== null || n < -1 || n >= titulos.length || n === pagina) return;
   setDir(n > pagina ? 1 : -1);
   const animar = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
   if (!animar || n === -1) { set(n); return; }
   const portada = pagina === -1;
   if (portada) setAbriendo(true);
   else setDestino(n);
   timer.current = setTimeout(() => {
     timer.current = null;
     setAbriendo(false);
     setDestino(null);
     set(n);
   }, portada ? 650 : 950);
 }
 function iniciarGesto(e) {
   gesto.current = null;
   if (e.touches.length !== 1 || e.target.closest('input,select,textarea,button,a,label')) return;
   const {clientX, clientY} = e.touches[0];
   gesto.current = {x:clientX, y:clientY};
 }
 function terminarGesto(e) {
   const inicio = gesto.current;
   gesto.current = null;
   if (!inicio || e.touches.length) return;
   const dx = e.changedTouches[0].clientX - inicio.x;
   const dy = e.changedTouches[0].clientY - inicio.y;
   if (Math.abs(dx) < 48 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
   ir(dx < 0 && pagina === titulos.length - 1 ? -1 : pagina + (dx < 0 ? 1 : -1));
 } useEffect(()=>{if(pagina>=0){opened.current=true;heading.current?.focus({preventScroll:true})}else if(opened.current)cover.current?.focus();function tecla(e){if(['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName))return;if(e.key==='ArrowRight')ir(pagina===titulos.length-1?-1:pagina+1);if(e.key==='ArrowLeft')ir(pagina-1)}window.addEventListener('keydown',tecla);return()=>window.removeEventListener('keydown',tecla)},[pagina]);
 return <main><Atmosfera/><header className="flex items-center justify-between"><span className="brand">S <i>&</i> N</span><span>NUESTRO CASAMIENTO</span></header><div className="scene">{pagina===-1?<Portada cover={cover} abriendo={abriendo} abrir={()=>ir(0)}/>:<div className="page-stack" onTouchStart={iniciarGesto} onTouchEnd={terminarGesto} onTouchCancel={()=>{gesto.current=null}}>
 { (destino===null ? [pagina] : [destino,pagina]).map(numero =>
 <article key={numero} inert={destino!==null} className={'paper pagina-'+numero+' '+(numero===pagina && destino!==null?'folding':numero===0 && destino===null?'first':'')}><div className="leaf">{numero!==0 && <span aria-hidden="true" className="lacrado">SN</span>}{numero!==0 && <><span className="eyebrow">✧ &nbsp; CAPÍTULO {['I','II','III','IV','V','VI','VII','VIII','IX','X'][numero]}</span><h1 ref={numero===pagina?heading:null} tabIndex={-1}>{titulos[numero]}</h1></>}{[
 <HeroBoda key="a" heading={numero===pagina?heading:null}/>,
 <Countdown key="b"/>,
 <figure key="c" className="album"><motion.img key={foto} initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.35}} src={'/fotos/'+fotos[foto][0]} alt={fotos[foto][1]}/><figcaption><button aria-label="Foto anterior" onClick={()=>setFoto((foto+fotos.length-1)%fotos.length)}>‹</button><span aria-live="polite">{fotos[foto][1]}<small>{foto+1} / {fotos.length}</small></span><button aria-label="Foto siguiente" onClick={()=>setFoto((foto+1)%fotos.length)}>›</button></figcaption></figure>,
 <div key="d"><p>El mejor regalo es compartir la mesa con vos. Si querés sumar un mimo para nuestra luna de miel, te dejamos el alias.</p><strong>{boda.alias}</strong><button className="action" onClick={async()=>{try{await navigator.clipboard.writeText(boda.alias);setCopiado('Alias copiado')}catch{setCopiado('Seleccioná el alias para copiarlo')}}}>Copiar alias</button><span role="status">{copiado}</span></div>,
 <div key="e"><p>¿Qué canción te haría salir a la pista? Ayudanos a escribir la banda sonora de esa noche.</p><Formulario tipo="musica"/></div>,
 <div key="f"><p>Nos encontramos entre árboles y brindis.</p><strong>{boda.salon}</strong><p>{boda.direccion}<br/>{boda.fechaLarga} · 18:30 h</p><div className="links"><a href={'https://www.google.com/maps/search/?api=1&query='+boda.lat+','+boda.lng} target="_blank" rel="noreferrer">Google Maps ↗</a><a href={'https://www.waze.com/ul?ll='+boda.lat+'%2C'+boda.lng+'&navigate=yes'} target="_blank" rel="noreferrer">Waze ↗</a></div></div>,
 <div key="vestimenta" className="vestimenta"><span className="lazo" aria-hidden="true">◇</span><strong>Elegante sport</strong><p>Un toque de fiesta, algo que te haga sentir vos y zapatos con los que bailarías hasta la última canción.</p><EjemplosVestimenta/></div>,
 <div key="notas" className="nota-invitados"><p>Si hay algo que debamos saber para que disfrutes la cena, contánoslo antes de la fiesta.</p><p>Y si sacás una foto de esas que nos hacen reír, guardánosla. Nos va a encantar ver la noche a través de tus ojos.</p><span>Sofi y Nico</span><Consejos/></div>,
 <div key="g"><p>Queremos guardarte un lugar en nuestra mesa.</p><Formulario tipo="asistencia"/></div>,
 <footer key="h"><img className="recuerdo-final" src="/fotos/galeria1.jpg" alt="Sofi y Nico abrazados"/><span className="final-firma" aria-hidden="true">S <i>&</i> N</span><p>Gracias por ser parte de nuestra historia.<br/>Nos vemos en el próximo capítulo.</p><strong>Sofi & Nico</strong></footer>
 ][numero]}</div></article>)}
 {destino!==null && <Pliegue reverso={dir<0}/>}
 </div>}</div><div className="bottom"><span/> {pagina<0?'NUESTRA HISTORIA':'SOFI & NICO'} <span/></div></main>}

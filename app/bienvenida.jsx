'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import './bienvenida.css';

const fotos=['puerta.webp','galeria1.jpg','galeria2.jpg','galeria3.jpg','galeria4.jpg','galeria5.JPG','galeria6.jpg','galeria7.jpg','elegante-sport.webp','flores2.png'];
export default function Bienvenida(){
 const audio=useRef(null), dialogo=useRef(null);
 const [progreso,setProgreso]=useState(0),[error,setError]=useState(false),[intento,setIntento]=useState(0),[entrado,setEntrado]=useState(false),[sonando,setSonando]=useState(false),[volumen,setVolumen]=useState(.5),[cabecera,setCabecera]=useState(null),[mensaje,setMensaje]=useState('');
 useEffect(()=>{setCabecera(document.querySelector('.acciones-cabecera'));dialogo.current.showModal()},[]);
 useEffect(()=>{
  let activo=true,completas=0;setError(false);setProgreso(0);
  Promise.all(fotos.map(src=>new Promise((resolve,reject)=>{
   const img=new Image();img.onload=async()=>{try{await img.decode();if(activo)setProgreso(++completas/fotos.length);resolve()}catch(e){reject(e)}};img.onerror=reject;img.src='/fotos/'+src;
  }))).catch(()=>{if(activo)setError(true)});
  return()=>{activo=false};
 },[intento]);
 async function reproducir(){try{audio.current.volume=volumen;await audio.current.play();setMensaje('')}catch{setMensaje('No pudimos iniciar la música. Tocá reproducir para intentar otra vez.')}}
 function entrar(musica){if(musica)reproducir();setEntrado(true);dialogo.current.close();document.querySelector('.tapa')?.focus()}
 return <>
  <audio ref={audio} src="/casamiento.mp3" loop preload="none" onPlay={()=>setSonando(true)} onPause={()=>setSonando(false)} onError={()=>setMensaje('La música no está disponible. Podés seguir disfrutando la invitación.')}/>
  <dialog ref={dialogo} className="bienvenida" aria-label="Bienvenidos a nuestra boda" onCancel={e=>e.preventDefault()} onKeyDown={e=>e.stopPropagation()}>
   <div className="bienvenida-interior">
    <p className="bienvenida-leyenda">UNA HISTORIA PARA COMPARTIR</p>
    <div className="iniciales-carga" aria-hidden="true"><span>S &amp; N</span><span style={{clipPath:`inset(${100-progreso*100}% 0 0)`}}>S &amp; N</span></div>
    {progreso<1 ? <><p role="status">{error?'Una imagen no pudo cargarse.':'Preparando cada capítulo de nuestra historia…'}</p><progress aria-label="Cargando las imágenes del libro" value={progreso} max="1"/>{error&&<button onClick={()=>setIntento(n=>n+1)}>Volver a intentar</button>}</> : <><h1>Bienvenidos a nuestra historia</h1><p>Elegí cómo querés vivir este momento.</p><div className="bienvenida-opciones"><button onClick={()=>entrar(true)}>Entrar con música ♡</button><button onClick={()=>entrar(false)}>Disfrutar en silencio</button></div></>}
   </div>
  </dialog>
  {entrado&&cabecera&&createPortal(<details className="musica-control" onKeyDown={e=>e.stopPropagation()}><summary aria-label="Controles de música">{sonando?'♫':'♪'}</summary><div className="musica-panel"><button onClick={()=>sonando?audio.current.pause():reproducir()}>{sonando?'Pausar música':'Reproducir música'}</button><label>Volumen<input aria-label="Volumen de la música" type="range" min="0" max="1" step="0.01" value={volumen} onChange={e=>{const v=Number(e.target.value);setVolumen(v);audio.current.volume=v}}/></label><span role="status">{mensaje}</span></div></details>,cabecera)}
 </>;
}

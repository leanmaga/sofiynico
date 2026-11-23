import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
export async function POST(request) {
 let data;
 try { data = await request.json() } catch { return Response.json({}, {status:400}) }
 const {tipo,nombre,detalle} = data || {};
 if (!['asistencia','musica'].includes(tipo) || [nombre,detalle].some(v=>typeof v !== 'string' || !v.trim() || v.length>200) || (tipo==='asistencia' && !['Voy a estar','No puedo ir'].includes(detalle))) return Response.json({}, {status:400});
 const dir=process.env.RESPUESTAS_DIR || path.join(process.cwd(),'respuestas');
 await mkdir(dir,{recursive:true});
 await writeFile(path.join(dir,randomUUID()+'.json'),JSON.stringify({tipo,nombre:nombre.trim(),detalle:detalle.trim(),fecha:new Date().toISOString()}),{flag:'wx'});
 return Response.json({ok:true});
}
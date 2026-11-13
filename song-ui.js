import {buttonLabel} from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
import {SONG_STORAGE,SONG_LIMIT,songLibraryRead,songSnapshot,songRender} from './song.js?v=6909bc96a5ec9b3981c89dc4fca150ed64875600c1b66e18653e3eb51f74db45';
export function songLibrarySetup(current,open) {
  const panel=document.getElementById('library-panel'),$=id=>panel.querySelector('#'+id)||document.getElementById(id);let library={version:1,songs:[]},selected=null,url=null,file=null,job=0;
  let initialized=false,track=null;
  const matches=song=>!track||!song.music.run||song.music.run.track===track;
  const source=()=>selected?library.songs.find(s=>s.id===selected&&matches(s)):(matches(current())?current():null);
  const status=text=>$('library-status').textContent=text;
  function clearPreview(){const hadPreview=!!url||$('song-prepare').disabled;job++;if(hadPreview)status('Prepare a highlight to listen or export.');$('song-prepare').disabled=false;$('song-audio').pause();$('song-audio').removeAttribute('src');$('song-audio').load();if(url)URL.revokeObjectURL(url);url=null;file=null;$('song-export').hidden=true;}
  function write(next){try{localStorage.setItem(SONG_STORAGE,JSON.stringify(next));library=next;return true;}catch{status('Could not save. Browser storage may be full or disabled. Export your highlight before closing.');return false;}}
  function render(){
    $('song-list').replaceChildren();
    const visible=library.songs.filter(matches),groups=track?[
      {title:null,songs:visible.filter(s=>s.music.run?.track===track)},
      {title:'Free Play & Older Songs',songs:visible.filter(s=>!s.music.run)}
    ]:[{title:null,songs:visible}];
    for(const group of groups){if(group.title&&group.songs.length){const heading=document.createElement('h4');heading.textContent=group.title;$('song-list').append(heading);}
    for(const song of group.songs){const button=document.createElement('button');button.className='quiet';buttonLabel(button,song.name,song.id===selected?'check':'music-note');button.setAttribute('aria-pressed',String(song.id===selected));button.onclick=()=>{selected=song.id;$('song-name').value=song.name;clearPreview();render();status('Saved song selected. Prepare a highlight to listen or export.');};$('song-list').append(button);}}
    $('song-rename').disabled=!selected;$('song-delete').disabled=!selected;buttonLabel($('song-delete'),'Delete saved song','trashcan-close');
    $('song-count').textContent=track?`${visible.filter(s=>s.music.run?.track===track).length} saved songs for this track`:`${library.songs.length} / ${SONG_LIMIT} saved songs · stored only in this browser`;
    $('song-current').hidden=!matches(current());$('song-save').disabled=!source();$('song-prepare').disabled=!source();
  }
  function refresh(){try{library=songLibraryRead(JSON.parse(localStorage.getItem(SONG_STORAGE)||'null'));if(selected&&!library.songs.some(s=>s.id===selected&&matches(s)))selected=null;render();}catch{status('Storage unavailable. You can still prepare and export the current song.');}}
  $('library-open').onclick=()=>open();
  $('song-current').onclick=()=>{if(!matches(current()))return;selected=null;$('song-name').value=current().name;clearPreview();render();status('Current pool song selected.');};
  $('song-save').onclick=()=>{const selectedSource=source();if(!selectedSource){status('Choose a saved song from this track first.');return;}const name=$('song-name').value.trim().slice(0,60);if(!name){status('Give this song a name first.');return;}if(library.songs.length>=SONG_LIMIT){status('Your library is full. Export and remove a saved song to make room.');return;}const song={id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`,name,created:Date.now(),music:songSnapshot(selectedSource.music)};if(write({...library,songs:[song,...library.songs]})){selected=song.id;render();status('Song kept. It will survive new games.');}};
  $('song-rename').onclick=()=>{const name=$('song-name').value.trim().slice(0,60);if(!selected||!name)return;if(write({...library,songs:library.songs.map(s=>s.id===selected?{...s,name}:s)})){clearPreview();render();status('Song renamed.');}};
  $('song-delete').onclick=()=>{if(!selected)return;if($('song-delete').textContent!=='Confirm deletion'){ buttonLabel($('song-delete'),'Confirm deletion','trashcan-close');status('Tap Confirm deletion to remove this saved song. Your pool is unaffected.');return;}if(write({...library,songs:library.songs.filter(s=>s.id!==selected)})){selected=null;clearPreview();render();status('Saved song removed.');}};
  $('song-prepare').onclick=async()=>{
    const selectedSource=source();if(!selectedSource){status('Choose a saved song from this track first.');return;}clearPreview();const ticket=job;$('song-prepare').disabled=true;status('Preparing your highlight…');
    try{const blob=await songRender(selectedSource.music);if(ticket!==job||!panel.closest('dialog')?.open||!panel.closest('details')?.open)return;url=URL.createObjectURL(blob);const name=($('song-name').value.trim()||selectedSource.name).replace(/[^\p{L}\p{N} _-]/gu,'').slice(0,60)||'Ricochet Bloom';file=new File([blob],`${name}.wav`,{type:'audio/wav'});$('song-audio').src=url;$('song-download').href=url;$('song-download').download=file.name;$('song-export').hidden=false;$('song-share').hidden=!navigator.canShare?.({files:[file]});status('Ready · 26 seconds · stereo WAV. Press play to listen, download, or share.');}
    catch(error){if(ticket===job)status(error.message||'Could not render audio. Your saved song is safe.');}finally{if(ticket===job)$('song-prepare').disabled=!source();}
  };
  $('song-share').onclick=async()=>{if(!file)return;try{await navigator.share({files:[file],title:file.name.replace('.wav','')});}catch(error){if(error.name!=='AbortError')status('Sharing unavailable. Use Download WAV instead.');}};
  return {mount(host,trackId=null){const changed=track!==trackId;if(changed){clearPreview();track=trackId;selected=null;}host.append(panel);panel.hidden=false;if(!initialized||changed){$('song-name').value=source()?.name||'';status(source()?'Choose a saved song or keep the current pool song.':'Choose a saved song from this track to listen or export.');initialized=true;}refresh();},refresh,close(){clearPreview();}};
}

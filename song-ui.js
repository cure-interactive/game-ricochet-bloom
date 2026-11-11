import {buttonLabel} from './ui-icon.js?v=6eefd3a5e72d754fea063666baf3166c1c88b5e72db4ab97072da15565143b81';
import {SONG_STORAGE,SONG_LIMIT,songLibraryRead,songSnapshot,songRender} from './song.js?v=6c8468e39d32c8b55eac9678fe7035241ebdb575f071a18e687ca7568a52961b';
export function songLibrarySetup(current,pause,resume) {
  const $=id=>document.getElementById(id),dialog=$('library-dialog');let library={version:1,songs:[]},selected=null,url=null,file=null,job=0;
  const status=text=>$('library-status').textContent=text;
  function clearPreview(){job++;$('song-audio').pause();$('song-audio').removeAttribute('src');$('song-audio').load();if(url)URL.revokeObjectURL(url);url=null;file=null;$('song-export').hidden=true;}
  function write(next){try{localStorage.setItem(SONG_STORAGE,JSON.stringify(next));library=next;return true;}catch{status('Could not save. Browser storage may be full or disabled. Export your highlight before closing.');return false;}}
  function render(){
    $('song-list').replaceChildren();
    for(const song of library.songs){const button=document.createElement('button');button.className='quiet';buttonLabel(button,song.name,song.id===selected?'check':'music-note');button.setAttribute('aria-pressed',String(song.id===selected));button.onclick=()=>{selected=song.id;$('song-name').value=song.name;clearPreview();render();status('Favorite selected. Prepare a highlight to listen or export.');};$('song-list').append(button);}
    $('song-rename').disabled=!selected;$('song-delete').disabled=!selected;buttonLabel($('song-delete'),'Delete favorite','trashcan-close');
    $('song-count').textContent=`${library.songs.length} / ${SONG_LIMIT} favorites · stored only in this browser`;
  }
  $('library-open').onclick=()=>{document.querySelectorAll('dialog[open]').forEach(panel=>panel.close());pause();try{library=songLibraryRead(JSON.parse(localStorage.getItem(SONG_STORAGE)||'null'));status('Save a favorite, or prepare a 26-second highlight of your current song.');}catch{status('Storage unavailable. You can still prepare and export the current song.');}selected=null;$('song-name').value=current().name;clearPreview();render();dialog.showModal();};
  $('song-current').onclick=()=>{selected=null;$('song-name').value=current().name;clearPreview();render();status('Current pool song selected.');};
  $('song-save').onclick=()=>{const name=$('song-name').value.trim().slice(0,60);if(!name){status('Give this song a name first.');return;}if(library.songs.length>=SONG_LIMIT){status('Your library is full. Export and remove a favorite to make room.');return;}const song={id:globalThis.crypto?.randomUUID?.()||`${Date.now()}-${Math.random()}`,name,created:Date.now(),music:songSnapshot(selected?library.songs.find(s=>s.id===selected).music:current().music)};if(write({...library,songs:[song,...library.songs]})){selected=song.id;render();status('Favorite saved separately from your game.');}};
  $('song-rename').onclick=()=>{const name=$('song-name').value.trim().slice(0,60);if(!selected||!name)return;if(write({...library,songs:library.songs.map(s=>s.id===selected?{...s,name}:s)})){clearPreview();render();status('Favorite renamed.');}};
  $('song-delete').onclick=()=>{if(!selected)return;if($('song-delete').textContent!=='Confirm deletion'){ buttonLabel($('song-delete'),'Confirm deletion','trashcan-close');status('Tap Confirm deletion to remove this favorite. Your pool is unaffected.');return;}if(write({...library,songs:library.songs.filter(s=>s.id!==selected)})){selected=null;clearPreview();render();status('Favorite removed.');}};
  $('song-prepare').onclick=async()=>{
    clearPreview();const ticket=job;$('song-prepare').disabled=true;status('Preparing your highlight…');
    try{const source=selected?library.songs.find(s=>s.id===selected):current(),blob=await songRender(source.music);if(ticket!==job||!dialog.open)return;url=URL.createObjectURL(blob);const name=($('song-name').value.trim()||source.name).replace(/[^\p{L}\p{N} _-]/gu,'').slice(0,60)||'Ricochet Bloom';file=new File([blob],`${name}.wav`,{type:'audio/wav'});$('song-audio').src=url;$('song-download').href=url;$('song-download').download=file.name;$('song-export').hidden=false;$('song-share').hidden=!navigator.canShare?.({files:[file]});status('Ready · 26 seconds · stereo WAV. Press play to listen, download, or share.');}
    catch(error){if(ticket===job)status(error.message||'Could not render audio. Your favorite is safe.');}finally{$('song-prepare').disabled=false;}
  };
  $('song-share').onclick=async()=>{if(!file)return;try{await navigator.share({files:[file],title:file.name.replace('.wav','')});}catch(error){if(error.name!=='AbortError')status('Sharing unavailable. Use Download WAV instead.');}};
  dialog.addEventListener('close',()=>{clearPreview();resume();});
}

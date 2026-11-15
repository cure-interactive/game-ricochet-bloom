// One idempotent lifecycle for live and offline synth voices. Safari can defer
// ended events through interruptions; expired nodes must not exhaust the budget.
export function voiceTrack(rack,voice,end,nodes){
 const voices=rack.audioVoices||(rack.audioVoices=new Set());
 voice.end=end;let released=false;
 voice.release=()=>{if(released)return;released=true;for(const node of nodes)node.disconnect();voices.delete(voice);rack.phraseVoices.delete(voice);rack.voiceCount=Math.max(0,rack.voiceCount-1);};
 voices.add(voice);rack.voiceCount++;voice.oscillator.onended=voice.release;
 return voice;
}
export function voicesReap(rack){
 const now=rack.context?.currentTime;
 for(const voice of rack.audioVoices||[])if(now>voice.end+.1)voice.release();
}
export function voicesStop(rack,group){
 for(const voice of rack.audioVoices||[])if(group===undefined||voice.group===group){try{voice.oscillator.stop();}catch{}voice.release();}
}

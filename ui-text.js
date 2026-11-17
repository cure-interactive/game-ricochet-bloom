// Format authored headings and control labels, never prose or saved player names.
export function titleCase(text) {
 const small=new Set(['a','an','the','and','but','or','nor','as','at','by','for','from','in','of','on','per','to','via','with']);
 const words=[...String(text).matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)];let index=0;
 return String(text).replace(/[A-Za-z]+(?:['’][A-Za-z]+)?/g,(word,offset)=>{
  const previous=words[index-1],next=words[index+1],before=String(text).slice(previous?previous.index+previous[0].length:0,offset),after=String(text).slice(offset+word.length,next?.index);
  const edge=index===0||index===words.length-1||/[:·—–!?]/.test(before)||/[:·—–!?]/.test(after)||after.startsWith('-');index++;
  if(!edge&&small.has(word.toLowerCase()))return word.toLowerCase();
  return /[A-Z]/.test(word.slice(1))?word:word[0].toUpperCase()+word.slice(1);
 });
}

// Text and quoted attributes share one escaping boundary; markup stays explicit.
export function escapeHTML(value) {
 return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

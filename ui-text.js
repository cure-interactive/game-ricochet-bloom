// Title case is applied only at heading boundaries; prose and saved names stay intact.
export function titleCase(text) {
 const small=new Set(['a','an','the','and','but','or','nor','as','at','by','for','from','in','of','on','per','to','via','with']);
 const words=[...String(text).matchAll(/[A-Za-z]+(?:['’][A-Za-z]+)?/g)];let index=0;
 return String(text).replace(/[A-Za-z]+(?:['’][A-Za-z]+)?/g,word=>{
  const edge=index===0||index===words.length-1;index++;
  return !edge&&small.has(word.toLowerCase())?word.toLowerCase():word[0].toUpperCase()+word.slice(1);
 });
}

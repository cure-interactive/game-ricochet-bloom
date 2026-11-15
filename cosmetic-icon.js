import {cosmeticThumbnailMount} from './cosmetic-preview.js?v=2b229bf52d006d9550d38d66a6667530c0260090e4fbdad9df8eca97f29e2e69';
import {cosmeticGet} from './cosmetic.js?v=7ec09556610ab987f7c5deb3143a3e4ba1da31461c131f3a4136838fa80ecdac';
export function registerCosmeticIcon(win=window){
 if(win.customElements.get('cosmetic-icon'))return;
 class CosmeticIcon extends win.HTMLElement{
  connectedCallback(){
   if(this.preview)return;this.canvas ||=this.ownerDocument.createElement('canvas');this.canvas.setAttribute('aria-hidden','true');if(!this.canvas.parentElement)this.append(this.canvas);
   const style=()=>win.getComputedStyle(this),kind=this.getAttribute('kind')==='bounce'?'bounce':'trail';
   this.preview=cosmeticThumbnailMount(this.canvas,()=>cosmeticGet(style().getPropertyValue('--cosmetic-id').trim()||style().getPropertyValue(kind==='trail'?'--player-trail':'--player-impact').trim())||cosmeticGet(kind==='trail'?'trail.original':'bounce.none'),{compact:true,color:()=>style().getPropertyValue('--player-skin-color').trim(),style:()=>style().getPropertyValue('--player-skin-style').trim()});
  }
  disconnectedCallback(){this.preview?.destroy();this.preview=null;}
 }
 win.customElements.define('cosmetic-icon',CosmeticIcon);
}

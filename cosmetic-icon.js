import {cosmeticThumbnailMount} from './cosmetic-preview.js?v=ef44992b33f6bb0df473aa3f210064ff51da16c16abafa758f7446d7247d986e';
import {cosmeticGet} from './cosmetic.js?v=97b306ab42d46dc2f32ef73e7417114b7e4c554d3db716a4334c31895c9d8d32';
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

import {cosmeticThumbnailMount} from './cosmetic-preview.js?v=33b1802d59d8fcb875b80ce7a043f1a515fdc5559e90f67794c0e4137b91e2ab';
import {cosmeticGet} from './cosmetic.js?v=0b32f7936068fa17090bc0edec50d142f4f145642fd37ef3110a6b59b56a93de';
export function registerCosmeticIcon(win=window){
 if(win.customElements.get('cosmetic-icon'))return;
 class CosmeticIcon extends win.HTMLElement{
  static get observedAttributes(){return ['kind'];}
  attributeChangedCallback(name,before,after){if(before!==after&&this.isConnected){this.disconnectedCallback();this.connectedCallback();}}
  connectedCallback(){
   if(this.preview)return;this.canvas ||=this.ownerDocument.createElement('canvas');this.canvas.setAttribute('aria-hidden','true');if(!this.canvas.parentElement)this.append(this.canvas);
   const style=()=>win.getComputedStyle(this),kind=this.getAttribute('kind')==='bounce'?'bounce':'trail';
   const diameter=()=>{
    const parent=this.parentElement,d=Math.max(1,parseFloat(style().getPropertyValue('--player-icon-size'))||parent.clientHeight);
    const minimum=kind==='trail'?d*2:d;
    if(parent.style.minWidth!==minimum+'px')parent.style.minWidth=minimum+'px';
    const wiki=parent.closest('.wiki-icon');if(wiki&&wiki.style.minWidth!==minimum+'px')wiki.style.minWidth=minimum+'px';
    return d;
   };
   this.preview=cosmeticThumbnailMount(this.canvas,()=>cosmeticGet(style().getPropertyValue('--cosmetic-id').trim()||style().getPropertyValue(kind==='trail'?'--player-trail':'--player-impact').trim())||cosmeticGet(kind==='trail'?'trail.original':'bounce.none'),{icon:true,surface:this,diameter,loadout:()=>({trail:style().getPropertyValue('--player-trail').trim()}),color:()=>style().getPropertyValue('--skin-color').trim()||style().getPropertyValue('--player-skin-color').trim(),style:()=>style().getPropertyValue('--skin-style').trim()||style().getPropertyValue('--player-skin-style').trim()});
  }
  disconnectedCallback(){this.preview?.destroy();this.preview=null;}
 }
 win.customElements.define('cosmetic-icon',CosmeticIcon);
}

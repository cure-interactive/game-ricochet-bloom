import {cosmeticThumbnailMount} from './cosmetic-preview.js?v=cd0f943bcdec8da44cd27b54aafb3826b3f32cb070d0f4656ff5fd968e967f15';
import {cosmeticGet} from './cosmetic.js?v=50f26a8ecaed06f42769edbf9c8dd50c2a0fa896dce11e53d36ad78d1830d695';
export function registerCosmeticIcon(win=window){
 if(win.customElements.get('cosmetic-icon'))return;
 class CosmeticIcon extends win.HTMLElement{
  static get observedAttributes(){return ['kind'];}
  attributeChangedCallback(name,before,after){if(before!==after&&this.isConnected){this.disconnectedCallback();this.connectedCallback();}}
  connectedCallback(){
   if(this.preview)return;this.canvas ||=this.ownerDocument.createElement('canvas');this.canvas.setAttribute('aria-hidden','true');if(!this.canvas.parentElement)this.append(this.canvas);
   const style=()=>win.getComputedStyle(this),kind=['bounce','pendant','companion'].includes(this.getAttribute('kind'))?this.getAttribute('kind'):'trail';
   const diameter=()=>{
    const parent=this.parentElement,d=Math.max(1,parseFloat(style().getPropertyValue('--player-icon-size'))||parent.clientHeight);
    const minimum=['trail','companion'].includes(kind)?d*2:d;
    if(parent.style.minWidth!==minimum+'px')parent.style.minWidth=minimum+'px';
    const wiki=parent.closest('.wiki-icon');if(wiki&&wiki.style.minWidth!==minimum+'px')wiki.style.minWidth=minimum+'px';
    return d;
   };
   this.preview=cosmeticThumbnailMount(this.canvas,()=>cosmeticGet(style().getPropertyValue('--cosmetic-id').trim()||style().getPropertyValue(kind==='bounce'?'--player-impact':'--player-'+kind).trim())||cosmeticGet(kind==='trail'?'trail.original':kind+'.none'),{icon:true,surface:this,diameter,loadout:()=>({trail:style().getPropertyValue('--player-trail').trim()}),color:()=>style().getPropertyValue('--skin-color').trim()||style().getPropertyValue('--player-skin-color').trim(),style:()=>style().getPropertyValue('--skin-style').trim()||style().getPropertyValue('--player-skin-style').trim()});
  }
  disconnectedCallback(){this.preview?.destroy();this.preview=null;}
 }
 win.customElements.define('cosmetic-icon',CosmeticIcon);
}

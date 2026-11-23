// A pending write retains its destination. Shared-build checkpoints and the
// originating player's wallet are separate owners even when both are Development.
export function profileSession({get,read,write,writeShared,reward,accept}){
  let pending=null;
  const rejected=()=>({ok:false,reason:'Resolve Progress Recovery before changing progress.'});
  function current(){const s=get();return {type:s.shared?'shared':'current',kind:s.kind,state:s.state,available:s.loaded.available,code:s.shared};}
  function origin(){const s=get();return s.suspended?{type:'suspended',...s.suspended,available:true}:current();}
  function rewardOwner(kind){const s=get();if(s.suspended?.kind===kind)return origin();if(!s.shared&&s.kind===kind)return current();return {type:'stored',kind,...read(kind)};}
  function persist(transaction){
    const {owner,earning}=transaction;
    let next=transaction.state,earned=null;
    if(earning){
      // A stored-profile retry rereads its receipt ledger before deduplicating.
      const source=owner.type==='stored'?read(owner.kind):owner;
      earned=source.available?reward(source.state.profile,earning):{ok:false,reason:'The earning profile could not be read.'};
      next=earned.ok?{...source.state,profile:earned.profile}:null;
      transaction.state=next;
    }
    const result=earned&&!earned.ok?earned:earned?.duplicate?{ok:true,state:next}:owner.type==='shared'?writeShared(next,owner.code):write(next);
    if(!result.ok){pending=transaction;return result;}
    pending=null;
    accept(owner,result.state);
    return {...result,amount:earned?.amount??0,notify:transaction.notify,after:transaction.after};
  }
  const api={
    get origin(){return origin();},
    get pending(){return pending;},
    get blocked(){return !!pending||!get().loaded.available;},
    get canSwitch(){return !pending;},
    commit(next,{owner=current(),after=null}={}){
      if(pending||!owner.available)return rejected();
      return persist({owner,state:structuredClone(next),after});
    },
    transact(change){
      if(api.blocked)return rejected();
      const owner=origin(),result=change(owner.state);
      if(!result.ok)return result;
      const saved=api.commit(result.state,{owner});
      return saved.ok?{...result,...saved}:saved;
    },
    settle(earning,notify=true){
      if(api.blocked)return rejected();
      if(!earning||!earning.shots)return {ok:true,amount:0};
      return persist({owner:rewardOwner(earning.kind),earning:structuredClone(earning),notify});
    },
    after(callback){if(pending)pending.after=callback;},
    retry(){return pending?persist(pending):{ok:true};}
  };
  return api;
}

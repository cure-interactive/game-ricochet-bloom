// A return path, not a log: revisiting a page removes the branch above it.
export function pageHistory(initial, key=value=>value) {
  let path=[initial];
  return {
    get current(){return path.at(-1);},
    get depth(){return path.length;},
    visit(page){const index=path.findIndex(value=>key(value)===key(page));if(index<0)path.push(page);else{path=path.slice(0,index+1);path[index]=page;}return page;},
    back(){if(path.length<=1)return null;path.pop();return path.at(-1);},
    reset(page){path=[page];return page;}
  };
}

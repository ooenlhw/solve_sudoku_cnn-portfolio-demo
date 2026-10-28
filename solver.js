(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.SudokuSolver=api})(typeof globalThis!=='undefined'?globalThis:this,function(){
  function validateGrid(input){
    if(!Array.isArray(input)||input.length!==81||input.some(n=>!Number.isInteger(n)||n<0||n>9))return {valid:false,message:'The grid must contain 81 cells with digits 1–9 or blanks.'};
    for(let unit=0;unit<9;unit++){
      const row=new Set(),col=new Set(),box=new Set();
      for(let i=0;i<9;i++){
        const r=input[unit*9+i],c=input[i*9+unit],br=Math.floor(unit/3)*3+Math.floor(i/3),bc=(unit%3)*3+i%3,b=input[br*9+bc];
        if(r&&row.has(r))return {valid:false,message:`Row ${unit+1} repeats ${r}.`};
        if(c&&col.has(c))return {valid:false,message:`Column ${unit+1} repeats ${c}.`};
        if(b&&box.has(b))return {valid:false,message:`A 3×3 box repeats ${b}.`};
        if(r)row.add(r);if(c)col.add(c);if(b)box.add(b);
      }
    }
    return {valid:true,message:''};
  }
  function candidates(board,index){const row=Math.floor(index/9),col=index%9,used=new Set();for(let i=0;i<9;i++){used.add(board[row*9+i]);used.add(board[i*9+col]);used.add(board[(Math.floor(row/3)*3+Math.floor(i/3))*9+Math.floor(col/3)*3+i%3])}return [1,2,3,4,5,6,7,8,9].filter(n=>!used.has(n))}
  function solveGrid(input){const check=validateGrid(input);if(!check.valid)return {solution:null,error:check.message};if(input.every(n=>n===0))return {solution:null,error:'Enter some clues or load the sample puzzle first.'};const board=input.slice();let nodes=0;function search(){if(++nodes>500000)return false;let best=-1,options=null;for(let i=0;i<81;i++){if(board[i])continue;const next=candidates(board,i);if(!next.length)return false;if(!options||next.length<options.length){best=i;options=next;if(next.length===1)break}}if(best===-1)return true;for(const n of options){board[best]=n;if(search())return true;board[best]=0}return false}return search()?{solution:board,error:null}:{solution:null,error:nodes>500000?'This puzzle needs more clues for a quick browser solve.':'No solution fits these clues.'}}
  return {validateGrid,solveGrid};
});

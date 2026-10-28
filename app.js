const sampleRows=[
  '800010009',
  '050807010',
  '004090700',
  '060701020',
  '508060107',
  '010502090',
  '007040600',
  '080309040',
  '300050008'
];
const sample=sampleRows.join('').split('').map(Number);
const grid=document.querySelector('#sudoku-grid');
const status=document.querySelector('#board-status');
const badge=document.querySelector('#board-badge');
let given=new Set();
let solved=new Set();
const cells=[];
for(let i=0;i<81;i++){
  const cell=document.createElement('input');
  cell.type='text';cell.inputMode='numeric';cell.maxLength=1;cell.autocomplete='off';
  cell.setAttribute('aria-label',`Row ${Math.floor(i/9)+1}, column ${i%9+1}`);
  if(i%9===2||i%9===5)cell.classList.add('box-right');
  if(Math.floor(i/9)===2||Math.floor(i/9)===5)cell.classList.add('box-bottom');
  cell.addEventListener('input',()=>{
    cell.value=cell.value.replace(/[^1-9]/g,'').slice(-1);
    cell.classList.remove('given','solved','invalid');
    given.delete(i);solved.delete(i);
    setStatus('Grid updated. Solve when ready.','ready');
  });
  cell.addEventListener('keydown',event=>{
    const direction={ArrowRight:1,ArrowLeft:-1,ArrowDown:9,ArrowUp:-9}[event.key];
    if(direction!==undefined){event.preventDefault();cells[Math.max(0,Math.min(80,i+direction))].focus()}
  });
  grid.append(cell);cells.push(cell);
}
function setStatus(message,state){status.textContent=message;status.className=`board-status ${state==='error'?'error':state==='solved'?'success':''}`;badge.textContent=state==='error'?'CHECK GRID':state==='solved'?'SOLVED':'READY';badge.className=`board-badge ${state==='error'?'error':state==='solved'?'solved':''}`}
function load(values){given=new Set();solved=new Set();values.forEach((n,i)=>{cells[i].value=n||'';cells[i].classList.remove('given','solved','invalid');if(n){given.add(i);cells[i].classList.add('given')}});setStatus('Sample puzzle loaded. Select Solve puzzle to see the answer.','ready')}
function currentGrid(){return cells.map(cell=>Number(cell.value)||0)}
function solve(){for(const cell of cells)cell.classList.remove('invalid');const input=currentGrid();const result=SudokuSolver.solveGrid(input);if(result.error){setStatus(result.error,'error');return}result.solution.forEach((n,i)=>{cells[i].value=n;if(!input[i]){cells[i].classList.add('solved');solved.add(i)}});setStatus('Solved! Blue digits were filled in by the browser solver.','solved')}
document.querySelector('#solve-button').addEventListener('click',solve);
document.querySelector('#reset-button').addEventListener('click',()=>load(sample));
document.querySelector('#clear-button').addEventListener('click',()=>{given=new Set();solved=new Set();for(const cell of cells){cell.value='';cell.classList.remove('given','solved','invalid')}setStatus('Grid cleared. Enter clues or load the sample puzzle.','ready');cells[0].focus()});
load(sample);

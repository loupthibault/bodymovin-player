import lottie from 'lottie-web';

const dom = {
  body: document.body,
  form: document.getElementById('form'),
  player: document.getElementById('player'),
  svg: null
};

var player = null, 
    isPlaying = false;

function isAdvancedUpload() {
  const div = document.createElement('div');
  return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
};

isAdvancedUpload() ? start() : showError();

function showError() { dom.body.classList.add('is-outdated'); }

function start() {
  dom.body.classList.add('is-available');
  addEvents();
}

function addEvents() {

  dom.form.addEventListener('drag', onDrag);
  dom.form.addEventListener('dragstart', onDrag);
  dom.form.addEventListener('dragover', onDragEnter);
  dom.form.addEventListener('dragenter', onDragEnter);
  dom.form.addEventListener('dragleave', onDragEnd);
  dom.form.addEventListener('dragend', onDragEnd);
  dom.form.addEventListener('drop', onDrop);
  
  dom.form.addEventListener('click', clickForm)

  window.addEventListener('click', onToogle);
}


//________________________________________________________ events
// -

// -------------- drag and drop

function clickForm(e) {
  e.preventDefault();
}

function onDrag(e) {
  e.preventDefault();
  e.stopPropagation();
}

function onDragEnter(e) {
  e.preventDefault();
  e.stopPropagation();
  dom.body.classList.add('is-dragover');
}

function onDragEnd(e) {
  e.preventDefault();
  e.stopPropagation();
  dom.body.classList.remove('is-dragover');
  
}

function onDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  dom.body.classList.remove('is-dragover');
  const droppedFiles = e.dataTransfer.files;
  if(!droppedFiles.length)return;
  const file = droppedFiles[0];
  const fr = new FileReader();
  fr.onload = onFileReaded;
  fr.readAsText(file);
}

// -------------- filreader

function onFileReaded(e) {
  dom.body.classList.add('is-playing');
  const json = JSON.parse(e.target.result);

  dom.player.innerHTML = '';
  isPlaying = true;

  player && player.destroy();

  player = lottie.loadAnimation({
    container: dom.player, // the dom element
    renderer: 'svg',
    loop: true,
    autoplay: true,
    animationData: json // the animation data
  });

  dom.svg = dom.player.querySelector('svg');
}

function onToogle(e) {
  if(!player)return;
  isPlaying = !isPlaying;
  isPlaying ? player.play() : player.pause();
}
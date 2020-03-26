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
  setupKeyDown();
}

function addEvents() {

  const a = 'addEventListener';

  dom.form[a]('drag', onDrag);
  dom.form[a]('dragstart', onDrag);
  dom.form[a]('dragover', onDragEnter);
  dom.form[a]('dragenter', onDragEnter);
  dom.form[a]('dragleave', onDragEnd);
  dom.form[a]('dragend', onDragEnd);
  dom.form[a]('drop', onDrop);
  
  dom.form[a]('click', clickForm)

  window[a]('click', onToogle);
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


/* -------- KeyDown -------- */

function setupKeyDown() 
{
  var i = -1;
  const list = ['w', 'b', 't'];
  const html = document.documentElement;
  
  const on = (e) => 
  {
    switch(e.keyCode)
    {

      case 67:
        i = ++i < list.length ? i : 0;
        html.dataset.th = list[i];
        break;
    }
  };


  document.addEventListener('keydown', on);
}
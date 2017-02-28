import classes    from 'dom-classes';
import {on, off}  from 'dom-events';
import bodymovin  from 'bodymovin';

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

function showError() { classes.add(dom.body, 'is-outdated'); }

function start() {
  classes.add(dom.body, 'is-available');
  addEvents();
}

function addEvents() {
  on(dom.form, 'drag', onDrag);
  on(dom.form, 'dragstart', onDrag);

  on(dom.form, 'dragover', onDragEnter);
  on(dom.form, 'dragenter', onDragEnter);

  on(dom.form, 'dragleave', onDragEnd);
  on(dom.form, 'dragend', onDragEnd);

  on(dom.form, 'drop', onDrop);

  on(dom.form, 'click', clickForm)

  on(window, 'click', onToogle);
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
  classes.add(dom.body, 'is-dragover');
}

function onDragEnd(e) {
  e.preventDefault();
  e.stopPropagation();
  classes.remove(dom.body, 'is-dragover');
}

function onDrop(e) {
  e.preventDefault();
  e.stopPropagation();
  classes.remove(dom.body, 'is-dragover');
  const droppedFiles = e.dataTransfer.files;
  if(!droppedFiles.length)return;
  const file = droppedFiles[0];
  const fr = new FileReader();
  fr.onload = onFileReaded;
  fr.readAsText(file);
}

// -------------- filreader

function onFileReaded(e) {
  classes.add(dom.body, 'is-playing');
  const json = JSON.parse(e.target.result);

  dom.player.innerHTML = '';
  isPlaying = true;

  player && player.destroy();

  player = bodymovin.loadAnimation({
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
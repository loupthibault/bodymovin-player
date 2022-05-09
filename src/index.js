import lottie from 'lottie-web';

const $body = document.body;

let player = null,
    isPlaying = false;

const isAdvancedUpload = () =>
{
    const div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
};

const showError = () => $body.classList.add('is-outdated');

const start = () =>
{
    $body.classList.add('is-available');
    addEvents();
    setupKeyDown();
};

const addEvents = () =>
{
    const a = 'addEventListener';
    const $form = document.getElementById('form');

    const onDrag = e =>  (e.preventDefault(), e.stopPropagation());

    $form[a]('drag', onDrag);
    $form[a]('dragstart', onDrag);
    $form[a]('dragover', onDragEnter);
    $form[a]('dragenter', onDragEnter);
    $form[a]('dragleave', onDragEnd);
    $form[a]('dragend', onDragEnd);
    $form[a]('drop', onDrop);

    $form[a]('click', e => e.preventDefault());

    window[a]('click', onToogle);
};


// ________________________________________________________ events
// -

// -------------- drag and drop

const onDragEnter = e =>
{
    e.preventDefault();
    e.stopPropagation();
    $body.classList.add('is-dragover');
};

const onDragEnd = e =>
{
    e.preventDefault();
    e.stopPropagation();
    $body.classList.remove('is-dragover');
};

const onDrop = e =>
{
    e.preventDefault();
    e.stopPropagation();
    $body.classList.remove('is-dragover');
    const droppedFiles = e.dataTransfer.files;
    if(!droppedFiles.length) return;
    const file = droppedFiles[0];
    const fr = new FileReader();
    fr.onload = onFileReaded;
    fr.readAsText(file);
};

// -------------- filreader

const onFileReaded = e =>
{
    const json = JSON.parse(e.target.result);
    const $player = document.getElementById('player');

    $body.classList.add('is-playing');
    $player.innerHTML = '';

    isPlaying = true;

    player && player.destroy();

    player = lottie.loadAnimation({
        container: $player, // the dom element
        renderer: 'svg',
        loop: true,
        autoplay: true,
        animationData: json // the animation data
    });
};

const onToogle = () =>
{
    if(!player) return;
    isPlaying = !isPlaying;
    isPlaying ? player.play() : player.pause();
};


/* -------- KeyDown -------- */

const setupKeyDown = () =>
{
    let i = -1;
    const list = ['w', 'b', 't'];
    const html = document.documentElement;

    const on = e =>
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
};


isAdvancedUpload() ? start() : showError();

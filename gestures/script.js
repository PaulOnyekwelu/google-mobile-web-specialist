//variable definitions
const track = document.querySelector('#track');
let initialPos = null;
let isPointerDown = false;
let transform = 0;


//function definitions
const GestureDownHandler = (e) => {
    e.preventDefault();
    if(e.touches){
        console.log(e.touches)
    }
    initialPos = e.pageX;
    isPointerDown = true;
    //getting the previous transform degree to add to the new move pageX
    const transformMatrix = window.getComputedStyle(track).getPropertyValue('transform');
    if(transformMatrix !== 'none'){
        const addendum = transformMatrix.split(',')[4];
        transform = parseInt(addendum);
    }
}

const GestureMoveHandler = (e) => {
    e.preventDefault();
    if(isPointerDown){
        const finalPos = e.pageX;
        const diff = finalPos - initialPos;
        //getting the previous transform degree to add to the new move pageX
        track.style.transform = `translateX(${transform + diff}px)`;
    }
    
}

const GestureEndHandler = (e) => {
    isPointerDown = false;
}

if(window.PointerEvent){
    //pointerEvent
    track.addEventListener('pointerdown', GestureDownHandler, true);
    track.addEventListener('pointermove', GestureMoveHandler, true);
    track.addEventListener('pointerup', GestureEndHandler, true);
    track.addEventListener('pointercancel', GestureEndHandler, true);
}else{
    //mouseEvent
    track.addEventListener('mousedown', GestureDownHandler, true);
    //track.addEventListener('mousemove', GestureMoveHandler, true);
    //track.addEventListener('mouseup', GestureEndHandler, true);

    //touchEvent
    track.addEventListener('touchstart', GestureDownHandler, true);
    track.addEventListener('touchmove', GestureMoveHandler, true);
    track.addEventListener('touchend', GestureEndHandler, true);
    track.addEventListener('touchcancel', GestureEndHandler, true);
}

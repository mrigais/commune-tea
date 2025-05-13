const socket = io()
const geolocation = navigator.geolocation
const form = document.querySelector('#message-form');
const inputField = form.querySelector('input')
const submitButton = form.querySelector('#submit')
const shareLocation = document.querySelector('#share-location')
socket.on('message', (message) => {
    console.log(message)
})

socket.on('sharedLocation', (coords) => {
    console.log('Here are the co ordinates',coords)
})

form.addEventListener('submit', (e)=>{

    e.preventDefault();
    const message = e.target.elements.message.value
    submitButton.setAttribute('disabled', 'disabled');
    socket.emit('sendMessage', message, (param)=> {
        submitButton.removeAttribute('disabled');
        inputField.value = '';
        inputField.focus();
        //this cb is responsible for acknowledgement, param is sent to the server side for it to run
        console.log('Message delivered', param)
    })

})

shareLocation.addEventListener('click', (e)=>{
    e.preventDefault()
    shareLocation.setAttribute('disabled', 'disabled');
    if(!navigator.geolocation){
        return alert('geolocation is not supported by your browser')
    }
    
    let current_position = geolocation.getCurrentPosition((success)=>{
        console.log(success)

        shareLocation.removeAttribute('disabled');
        socket.emit('shareLocation', success.coords, (param)=>{
            console.log(`Following location was shared with clients : ${param.latitude} ${param.longitude}`)
        })
    });
})
function previewImage(event) {
    var reader = new FileReader();
    reader.onload = function(){
        var output = document.getElementById('preview');
        output.src = reader.result;
        output.style.display = 'block';
    };
    if(event.target.files[0]) {
        reader.readAsDataURL(event.target.files[0]);
    }
}

function openCamera() {
    var video = document.getElementById('video');
    var canvas = document.getElementById('canvas');
    video.style.display = 'block';
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(function(stream) {
            video.srcObject = stream;
            video.play();
            // Add capture button
            if (!document.getElementById('captureBtn')) {
                var btn = document.createElement('button');
                btn.innerText = '캡처';
                btn.type = 'button';
                btn.id = 'captureBtn';
                btn.onclick = function() { capturePhoto(video, canvas, stream); };
                video.parentNode.insertBefore(btn, video.nextSibling);
            }
        })
        .catch(function(err) {
            alert('웹캠 접근 실패: ' + err);
        });
}

function capturePhoto(video, canvas, stream) {
    var context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    var dataURL = canvas.toDataURL('image/png');
    document.getElementById('preview').src = dataURL;
    document.getElementById('preview').style.display = 'block';
    canvas.style.display = 'none';
    video.style.display = 'none';
    // Stop webcam
    stream.getTracks().forEach(track => track.stop());
    // Convert dataURL to Blob and set as file input
    fetch(dataURL)
        .then(res => res.blob())
        .then(blob => {
            var file = new File([blob], 'webcam.png', {type: 'image/png'});
            var dt = new DataTransfer();
            dt.items.add(file);
            document.getElementById('photo').files = dt.files;
        });
    // Remove capture button
    var btn = document.getElementById('captureBtn');
    if (btn) btn.remove();
}

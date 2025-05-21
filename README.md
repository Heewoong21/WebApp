# WebApp  

## 1. 가상환경 만들기  
conda create -n webapp python=3.9  

## 2. 폴더 구성  
![image](https://github.com/user-attachments/assets/c343171d-203c-487e-a109-594ab2c819bd)

## 3. 실행 방법  
![image](https://github.com/user-attachments/assets/45809733-304e-41c7-94de-d881e3ee3ab8)  
http://127.0.0.1:5000 을 Ctrl 버튼 누르고 클릭을 하게되면  

![image](https://github.com/user-attachments/assets/4d8df820-6d45-499f-a6a5-d7e8314b9eef)  
이렇게 뜨는데 안에 값들을 다 입력하고 Add Contact 버튼을 누르면 화면에 있던 값이 파이썬으로 넘어가서  
사진은 upload안에 들어가고 addbook.txt에는 이름, 전화번호, 생일, 사진 이름이 차례대로 들어가게 된다.

![image](https://github.com/user-attachments/assets/98624b80-1e67-4a8f-9202-9df90ca30866)


## 2차 추가 기능
### 웹 캠으로 사진찍어서 서버에 보내기  
```
<!DOCTYPE html>
<html lang="en">
<head>
   <link rel="stylesheet" href="{{ url_for('static', filename='css/style.css') }}">
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Address Book</title>
</head>
<body>
    <h1>Address Book</h1>
    <form id="contactForm" action="/add" method="post" enctype="multipart/form-data" onsubmit="return showPreview();">
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
        <br><br>
        <label for="phone">Phone:</label>
        <input type="text" id="phone" name="phone" required>
        <br><br>
        <label for="birthday">Birthday:</label>
        <input type="date" id="birthday" name="birthday">
        <br><br>
        <label for="photo">Photo:</label>
        <input type="file" id="photo" name="photo" accept="image/*" onchange="previewImage(event)">
        <button type="button" onclick="openCamera()">웹캠으로 사진 찍기</button>
        <br><br>
        <video id="video" width="200" height="150" autoplay style="display:none;"></video>
        <canvas id="canvas" width="200" height="150" style="display:none;"></canvas>
        <img id="preview" src="#" alt="Image Preview" style="display:none; max-width:150px; max-height:150px;"/>
        <br><br>
        <button type="submit">Add Contact</button>
    </form>
    <script>
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
    </script>
</body>
</html>
```

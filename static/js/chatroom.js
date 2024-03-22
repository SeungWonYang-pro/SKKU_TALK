var Curr_User = "";
var Room_ID = 0;

var ws = new WebSocket("ws://localhost:8000/ws");
var curBlob="";

function set_username(user) {
    Curr_User = user.name;
    console.log(Curr_User);
}

ws.onmessage = function (event) {
    var text = event.data;
    var strs = text.split(',');
    var params = window.location.search.split('&&');
    var Room_ID = Number(params[1].split('=')[1]);
    if (strs[3] != Room_ID) {
        return;
    }

    if(strs[4]=="Image")
    {
    }
    else
    {
        console.log("Notimage");
    }

    console.log(strs[0]);
    console.log(strs[1]);
    console.log(strs[2]);
    let textMsg = strs[2].replaceAll(/(\n|\r\n)/g, "<br>");




    if (strs[0] == Curr_User) {
        // sender
        var newEntireMsg = document.createElement('div');
        var newMsgCont = document.createElement('div');
        var newTimeCont = document.createElement('div');
        newEntireMsg.className = 'containerRight';
        newMsgCont.className = 'rightTalk';
        newTimeCont.className = 'timeDiv';

        newMsgCont.innerHTML = textMsg;
        newTimeCont.innerHTML = strs[1];

        newEntireMsg.appendChild(newMsgCont);
        newEntireMsg.appendChild(newTimeCont);
        $("#userCont").append(newEntireMsg);
        var userDiv = document.getElementById("userCont");
        userDiv.scrollTop = userDiv.scrollHeight;



    }
    else {


        var newLeftDiv = document.createElement('div');
        newLeftDiv.className = 'wrapperLeft';

        var newIdDiv = document.createElement('div');
        newIdDiv.className = 'containerLeftName';
        var newIdNameDiv = document.createElement('div');
        newIdNameDiv.className = 'leftName';

        newIdNameDiv.innerHTML = strs[0];
        newIdDiv.appendChild(newIdNameDiv);


        var newEntireMsg = document.createElement('div');
        var newMsgCont = document.createElement('div');
        var newTimeCont = document.createElement('div');
        newEntireMsg.className = 'containerLeft';
        newMsgCont.className = 'leftTalk';
        newTimeCont.className = 'timeDiv';

        newMsgCont.innerHTML = textMsg;
        newTimeCont.innerHTML = strs[1];

        newEntireMsg.appendChild(newMsgCont);
        newEntireMsg.appendChild(newTimeCont);


        newLeftDiv.appendChild(newIdDiv);
        newLeftDiv.appendChild(newEntireMsg);


        $("#userCont").append(newLeftDiv);
        var userDiv = document.getElementById("userCont");
        userDiv.scrollTop = userDiv.scrollHeight;

    }

};


function readImg() {
    var file1 = document.getElementById("file1");
    file1.addEventListener("change", loadImage);
    function loadImage(e) {
        console.log(e.target);
        var file = e.target.files[0];
        var reader = new FileReader();
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.toBlob( blob=> {
                let data = window.URL.createObjectURL(blob);
                let img = new Image();
                img.src = data;
                curBlob=blob;
                $("#userCont").append(img);                
                var file1 = document.getElementById("file1");
                console.log(img);
            }

        );
        console.log(file);
        file1.className=file;
        reader.readAsDataURL(file);
    }
}

function backToMain() {
    var params = window.location.search.split('&&');
    var id = params[0].split('=')[1];
    window.location.href = "/mainpage?Id=" + id;
}

function get_cr_list() {
    var params = window.location.search.split('&&');
    var id = params[0].split('=')[1];
    window.location.href = "/chatrooms?Id=" + id;
}

$(document).ready(function () {
    var params = window.location.search.split('&&');
    var id = params[0].split('=')[1];
    var Room_ID = Number(params[1].split('=')[1]);
    var data = { "u_id": id };
    console.log(id);
    // 사용자 이름 설정
    $.ajax({
        url: "/username",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success: set_username,
        error: function (e) {
            alert("fail!");
        }
    });
    $("#inputMSG").on('keydown', function (event) {
        if (event.keyCode == 13) {
            if (!event.shiftKey) {
                event.preventDefault();
            }
        }
    });

    $("#inputMSG").on('keyup', function (event) {
        if (event.keyCode == 13) {
            if (!event.shiftKey) {
                event.preventDefault();
                var button = document.getElementById('sendButton');
                button.click();
            }
        }
    });
    updateTable();
    $("#backBtn").click(backToMain);
    $("#chrBtn").click(get_cr_list);


});



function updateTable() {                        // 시작할 때 데이터 불러와서 업데이트  및 SendButton 활성화

    var params = window.location.search.split('&&');
    var Room_ID = Number(params[1].split('=')[1]);

    $("#sendButton").click(sendMessage);
    data = { "chrm_id": Room_ID };
    console.log(typeof (Room_ID));
    // 현재 속한 채팅방 대화 불러오기
    $.ajax({
        url: "/getmsglist",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success: makeChatDiv,
        error: function (e) {
            alert("fail!");
        }
    });

}


function makeChatDiv(msgList) {


    msgList.forEach(item => {
        console.log(item);


        var date = new Date(item.time);
        var curHour = date.getHours();
        var curMin = date.getMinutes();
        var timestr = "";
        if (curHour >= 12) {
            timestr = "오후 ";
            if (curHour > 12) {
                curHour = curHour - 12;
            }
            let minstr = "";
            if (curMin < 10) {
                minstr = "0";
            }

            timestr = timestr + curHour + ":" + minstr + curMin;
        }
        else {
            timestr = "오전 ";
            let minstr = "";

            if (curMin < 10) {
                minstr = "0";
            }

            timestr = timestr + curHour + ":" + minstr + curMin;
        }
        if (item.sender == Curr_User) {
            var newEntireMsg = document.createElement('div');
            var newMsgCont = document.createElement('div');
            var newTimeCont = document.createElement('div');
            newEntireMsg.className = 'containerRight';
            newMsgCont.className = 'rightTalk';
            newTimeCont.className = 'timeDiv';

            newMsgCont.innerHTML = item.msg;
            newTimeCont.innerHTML = timestr;

            newEntireMsg.appendChild(newMsgCont);
            newEntireMsg.appendChild(newTimeCont);
            $("#userCont").append(newEntireMsg);
            var userDiv = document.getElementById("userCont");
            userDiv.scrollTop = userDiv.scrollHeight;

        }
        else {
            var newLeftDiv = document.createElement('div');
            newLeftDiv.className = 'wrapperLeft';

            var newIdDiv = document.createElement('div');
            newIdDiv.className = 'containerLeftName';
            var newIdNameDiv = document.createElement('div');
            newIdNameDiv.className = 'leftName';

            newIdNameDiv.innerHTML = item.sender;
            newIdDiv.appendChild(newIdNameDiv);


            var newEntireMsg = document.createElement('div');
            var newMsgCont = document.createElement('div');
            var newTimeCont = document.createElement('div');
            newEntireMsg.className = 'containerLeft';
            newMsgCont.className = 'leftTalk';
            newTimeCont.className = 'timeDiv';

            newMsgCont.innerHTML = item.msg;
            newTimeCont.innerHTML = timestr;

            newEntireMsg.appendChild(newMsgCont);
            newEntireMsg.appendChild(newTimeCont);


            newLeftDiv.appendChild(newIdDiv);
            newLeftDiv.appendChild(newEntireMsg);


            $("#userCont").append(newLeftDiv);
            var userDiv = document.getElementById("userCont");
            userDiv.scrollTop = userDiv.scrollHeight;
        }
    })

}




function sendMessage(event) {
    var params = window.location.search.split('&&');
    var chrm_id = params[1].split('=')[1];
    var isImage="NotImage";
    var imgData ="";
    var input = document.getElementById("inputMSG");
    if (input.value.trim() == "") {
        return;
    }
    var timestamp = Date.now();
    var date = new Date(timestamp);
    var curHour = date.getHours();
    var curMin = date.getMinutes();
    var timestr = "";
    if (curHour >= 12) {
        timestr = "오후 ";
        if (curHour > 12) {
            curHour = curHour - 12;
        }
        let minstr = "";
        if (curMin < 10) {
            minstr = "0";
        }

        timestr = timestr + curHour + ":" + minstr + curMin;
    }
    else {
        timestr = "오전 ";
        let minstr = "";

        if (curMin < 10) {
            minstr = "0";
        }

        timestr = timestr + curHour + ":" + minstr + curMin;
    }
    var strs = [];
    strs.push(Curr_User);
    strs.push(timestr);
    strs.push(input.value);
    strs.push(chrm_id);
    strs.push(isImage);
    strs.push(imgData);
    let textMsg = strs[2].replaceAll(/(\n|\r\n)/g, "<br>");


    var sender = Curr_User;
    var msg = textMsg;

    var data = { "chrm_id": chrm_id, "sender": sender, "msg": msg, "time": timestamp };
    // 대화 내용 DB에 추가
    $.ajax({
        url: "/postmsg",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: function () {
            console.log("success");
        }
    });

    ws.send(strs);


    input.value = '';
    event.preventDefault();
}

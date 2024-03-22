
var ws = new WebSocket("ws://localhost:8000/ws");
var chatRoomId = [];


ws.onmessage = function (event) {
    var text = event.data;
    var strs = text.split(',');
    console.log(strs[0]);
    console.log(strs[2]);
    console.log(strs[3]);
    var forMe = false;
    for (i = 0; i < chatRoomId.length; i++) {
        if (String(chatRoomId[i]) == String(strs[3])) {
            console.log(chatRoomId[i]);
            forMe = true;
            break;
        }
    }
    if (!forMe) {
        return;
    }


    var newCT = document.getElementById("newCT");
    var newMsg = document.getElementById("newMsg");
    var newMsgCont = document.getElementById("newMsgCont");
    var title = document.getElementById("title");
    newCT.innerHTML = strs[0];
    newMsg.innerHTML = strs[2];
    
    title.classList.add('displayHidden');
    
    newMsgCont.classList.remove('displayHidden');
    setTimeout(() => {
        newMsgCont.classList.add('displayHidden');
        title.classList.remove('displayHidden');
    }, 2000);
    
};

function updateChatRoom(data) {
    chatRoomId = [];
    data.forEach(element => {
        chatRoomId.push(element.chrm_id);
    })
}

function set_username(user){
    var title = document.getElementById("title");
    title.innerHTML = user.name;
    console.log(user);
}



function backToMain(){
    var id = window.location.search.split('=')[1];
    window.location.href = "/mainpage?Id=" + id;        
}

function get_cr_list(){
    var id = window.location.search.split('=')[1];
    window.location.href = "/chatrooms?Id=" + id;        
}

// 실제 친구 관계 DB 추가 
function onClickAdd(obj) {
    var id = window.location.search.split('=')[1];
    var u_id_2 = obj.target.id;
    console.log(id,u_id_2);
     var data = { "u_id_1":id, "u_id_2":u_id_2};
    $.ajax({
        url: "/addFriend",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success: function(data){
            console.log(data);
        },
        error: function(e){
            alert("fail!");
        }
    });
   var f_cont = document.getElementById('friendCont');
   f_cont.removeChild(obj.target.parentNode);

}
//후보 친구 Div 추가
function update_new_friends(user){
    user.forEach(element => {
        var newDiv = "<div class=\"friend\">"+ element.name + " <input type=\"button\" class=\"addBtn\" value=\"Add\" id=\""+ element.u_id+"\" /></div>";
        $("#friendCont").append(newDiv);
    });

    $(".addBtn").click(onClickAdd);


}

$(document).ready(function () {
    var title = document.getElementById("title");
    var id = window.location.search.split('=')[1];
    var data = {"u_id" : id};
    console.log(id);
    //사용자 이름 설정
    $.ajax({
        url: "/username",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success: set_username,
        error: function(e){
            alert("fail!");
        }
    })
    //사용자와 친구관계가 아닌 친구 불러오기
    $.ajax({
        url: "/getNewFriends",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success: update_new_friends,
        error: function(e){
            alert("fail!");
        }
    })

    var gchdata = { "u_ids": id };
    //채팅 알림 기능에서 이 사용자에게 온 채팅이 맞는 지 확인할 때 사용
    $.ajax({
        url: "/getchatroomlist",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(gchdata),
        success: updateChatRoom,
        error: function (e) {
            alert("fail!");
        }
    })

    $("#backBtn").click(backToMain);
    $("#chrBtn").click(get_cr_list);

    
});
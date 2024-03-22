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

var friend_list=[];
var checked_list=[];

// 체크박스 체크 됐는 지 확인 
function onClickCreate(event){
    console.log(event.target);
    var ind=0;
    for (i = 0; i<friend_list.length; i++)
    {
        if(friend_list[i]==event.target.id)
        {
            ind=i;
            break;
        }
    }
    checked_list[ind]=event.target.checked;
    
}

// 그룹 채팅방에 초대할 친구 리스트 불러오기
function get_friends(friends){
    friends.forEach(element => {
        var data = {"u_id" : element.u_id_2 };
        $.ajax({
        url: "/username",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success:  function(data){
            var newDiv = "<div class=\"friend\">"+ data.name + " <input type=\"checkbox\" class=\"stChBtn\" value=\"Start Chat\" id="+ element.u_id_2+" /></div>";
            $("#friendCont").append(newDiv);
            $("#"+element.u_id_2).click(onClickCreate);        
            friend_list.push(element.u_id_2);
            checked_list.push(false);
        },
        error: function(e){
            alert("fail!Here");
        }
        });

    });
}

//그룹 채팅 형성 후 DB에 저장
function make_GrCh(e){
    var id = window.location.search.split('=')[1];
    var group_list=[id];
    for (i=0 ; i< checked_list.length; i++)
    {
       if(checked_list[i])
       {
            group_list.push(friend_list[i]);
       }
    }

    u_id1= group_list.join('|');
    var id = window.location.search.split('=')[1];
    var data = {"u_ids": u_id1};

    $.ajax({
        url: "/createChatroom",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success: function(data){
            window.location.href = "/chatroom?Id=" + id + "&&cId="+data.chrm_id;        

        },
        error: function(e){
            alert("fail!");
        }
    });
   
    
}
function get_f_list(){
    var id = window.location.search.split('=')[1];
    window.location.href = "/newFriend?Id=" + id;        
}
function get_cr_list(){
    var id = window.location.search.split('=')[1];
    window.location.href = "/chatrooms?Id=" + id;        
}
$(document).ready(function () {
    var title = document.getElementById("title");
    var id = window.location.search.split('=')[1];
    var data = {"u_id" : id };

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
    });

    //그룹 채팅 초대할 수 있는 친구 불러오기
    $.ajax({
        url: "/getFriends",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success: get_friends,
        error: function(e){
            alert("fail!");
        }
    });
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
    $("#addFBtn").click(get_f_list);
    $("#chrBtn").click(get_cr_list);
    $("#stGrChBtn").click(make_GrCh);
});
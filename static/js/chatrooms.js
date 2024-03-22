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

    var chatComp = document.getElementsByClassName('chat');
    
    console.log(chatComp);
    var chatMsg ;
    for (i=0; i < chatComp.length; i++)
    {
        if(chatComp[i].id==strs[3])
        {
            chatMsg=chatComp[i];
            chatMsg.childNodes[3].innerHTML=strs[2];
        }
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

function makeLastChat(data)
{   
    if( data.length == 0)
    {
        return;
    }
    else
    {
        chat = data[data.length-1];
        console.log(chat);
        chatDiv = document.getElementById(String(chat.chrm_id));
        chatDiv.children[1].innerHTML=chat.msg;
    }

}
var tempUserName="";
function getusername(u_id){
    var data = {"u_id" : u_id};
    $.ajax({
        url: "/username",
        type: "post",
        async: false,
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success: function(ret){
            tempUserName=ret.name;
        },
        error: function(e){
            alert("fail!");
        }
    })
    var name = tempUserName
    return name;
}


function updateChatRoom(user){
    chatRoomId=[];
    user.forEach(element => {
        chatRoomId.push(element.chrm_id);

        var id = window.location.search.split('=')[1];
        var newDiv  = document.createElement('div');
        newDiv.className="chat";
        newDiv.id= String(element.chrm_id);
        var newCTDiv =  document.createElement('div');
        newCTDiv.className="chatTitle";
        var uids = element.u_ids.split('|');
        var uids_ex=[]
        console.log(uids);
        for (i=0; i<uids.length; i++)
        {
            if(uids[i] ==id){
            }
            else
            {
                uids_ex.push(uids[i]);
            }
        }

        var usernames = uids_ex.map(getusername)
        console.log(usernames);
        newCTDiv.innerHTML=usernames.join(',');
        newDiv.appendChild(newCTDiv);
        var newDivText= "<div class=\"chat\" id =\""+element.chrm_id+"\" > <div class=\"chatTitle\" id=\""+element.chrm_id+"\" >"+ usernames.join(',') +"</div> <div class=\"chatMsg\" >No Message Yet </div> </div>"; 

        
        $("#chatRoomCont").append(newDivText);
        $("#"+element.chrm_id).click(onClickCreate);
        data = { "chrm_id": element.chrm_id };    
        $.ajax({
            url: "/getmsglist",
            type: "post",
            contentType: "application/JSON",
            data: JSON.stringify(data),
            success: makeLastChat,
            error: function (e) {
                alert("fail!");
            }
        });
    });

}
function onClickCreate(event){
    console.log(event.currentTarget.id);
    var id = window.location.search.split('=')[1];
    window.location.href = "/chatroom?Id=" + id + "&&cId="+event.currentTarget.id;        

}
function make_GrCh(){
    var id = window.location.search.split('=')[1];
    window.location.href = "/makegroup?Id=" + id;       
}

$(document).ready(function () {
    var title = document.getElementById("title");
    var id = window.location.search.split('=')[1];
    var data = {"u_id" : id};
    console.log(id);
    //사용자 설정
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

    var gchdata = {"u_ids":id};
    //채팅방 리스트 업데이트 및 채팅 알림 기능에서 이 사용자에게 온 채팅이 맞는 지 확인할 때 사용
    $.ajax({
        url: "/getchatroomlist",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(gchdata),
        success: updateChatRoom,
        error: function(e){
            alert("fail!");
        }
    })

    $("#backBtn").click(backToMain);
    $("#chrBtn").click(get_cr_list);

    $("#stGrChBtn").click(make_GrCh);

    
});
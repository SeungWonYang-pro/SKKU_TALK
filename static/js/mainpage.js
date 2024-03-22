
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

function set_username(user) {
    var title = document.getElementById("title");
    title.innerHTML = user.name;
    console.log(user);
}

function onClickCreate(event) {
    var id = window.location.search.split('=')[1];
    var f_id = event.target.id;
    var u_id1 = id + "|" + f_id;
    var u_id2 = f_id + "|" + id;
    var datas = { "u_id1": u_id1, "u_id2": u_id2 };
    var data = { "u_ids": u_id1 };
    $.ajax({
        url: "/getChatroom",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(datas),
        success: function (data) {
            console.log(data);
            window.location.href = "/chatroom?Id=" + id + "&&cId=" + data.chrm_id;
        },
        error: function (e) {
            $.ajax({
                url: "/createChatroom",
                type: "post",
                contentType: "application/JSON",
                data: JSON.stringify(data),
                success: function (data) {
                    window.location.href = "/chatroom?Id=" + id + "&&cId=" + data.chrm_id;

                },
                error: function (e) {
                    alert("fail!");
                }
            });
        }
    });

}

function get_friends(friends) {
    friends.forEach(element => {
        var data = { "u_id": element.u_id_2 };
        $.ajax({
            url: "/username",
            type: "post",
            contentType: "application/JSON",
            data: JSON.stringify(data),
            success: function (data) {
                var newDiv = "<div class=\"friend\">" + data.name + " <input type=\"button\" class=\"stChBtn\" value=\"Start Chat\" id=" + element.u_id_2 + " /></div>";
                $("#friendCont").append(newDiv);
                $("#" + element.u_id_2).click(onClickCreate);

            },
            error: function (e) {
                alert("fail!Here");
            }
        });

    });
}


function get_f_list() {
    var id = window.location.search.split('=')[1];
    window.location.href = "/newFriend?Id=" + id;
}
function get_cr_list() {
    var id = window.location.search.split('=')[1];
    window.location.href = "/chatrooms?Id=" + id;
}
$(document).ready(function () {
    var title = document.getElementById("title");
    var id = window.location.search.split('=')[1];
    var data = { "u_id": id };

    $("#addFBtn").click(get_f_list);
    $("#chrBtn").click(get_cr_list);
    console.log(id);
    //사용자 이름 설정
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
    //사용자 친구 관계 불러오기
    $.ajax({
        url: "/getFriends",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success: get_friends,
        error: function (e) {
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
});
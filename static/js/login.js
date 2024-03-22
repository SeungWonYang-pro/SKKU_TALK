
$(document).ready(function () {
    $("#loginBtn").click(onClickLogin);
});

function onClickLogin() {
    var id = document.getElementById("idInput").value;
    var pwd = document.getElementById("pwInput").value;
    var data = { "u_id":id, "password":pwd};
    //로그인 기능
    $.ajax({
        url: "/token",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success: function (data, txtStatus, xhr){
            window.location.href = "/mainpage?Id=" + id;        
        },
        error: function(e){
            alert("fail!");
        }
    })

}

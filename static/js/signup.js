//회원 가입 후 DB에 저장
$(document).ready(function () {
    $("#suBtn").click(onClickLogin);
});
function onClickLogin() {
    var id = document.getElementById("idInput").value;
    var name = document.getElementById('nameInput').value;
    var pwd = document.getElementById("pwInput").value;
    var data = {"u_id": id, "name":name, "password":pwd};

    $.ajax({
        url: "/register",
        type: "post",
        contentType: "application/JSON",
        data: JSON.stringify(data),
        success: function (data, txtStatus, xhr){
            window.location = "/";
        },
        error: function(e){
            alert("fail!");
        }
    })

}
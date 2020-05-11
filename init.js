document.cookie = 'same-site-cookie=foo; SameSite=Lax';
document.cookie = 'cross-site-cookie=bar; SameSite=None; Secure';
$(document).ready(function() {
    $('.summernote').summernote({
      height: 300,
      tabsize: 2,
      placeholder :"내용을 입력하세요.",
      focus: true,
      lang : 'ko-KR',
      callbacks: {	//여기 부분이 이미지를 첨부하는 부분
					onImageUpload : function(files, editor, welEditable) {
            uploadImage(files[0],editor, welEditable);
					}
				}
    });
    $("#save").click(function(){
      if($(".note-editable").length<0){
        alert("초기화 에러입니다. 다시 접속해 주세요");
        return;
      }
      var title = $(".title").val();
      var content = $(".note-editable").html();
      saveContent(title,content);
    });
    $(".logo").click(function(){
      location.href = "https://simplenotice.site";
    });

    initContents();
});

function checkFileSize(file){
  var fileSize = file.size;
  var maxSize = 2 * 1024 * 1024;//2MB

  if(fileSize > maxSize){
     return false;
  }
  return true;
}
function uploadImage(file,editor,welEditable){
  if(!checkFileSize(file)){
    alert("이미지가 너무 큽니다. (최대 2MB)");
    return;
  }
  var data = new FormData();
	data.append("files", file);

  $.ajax({
    url: 'https://api.simplenotice.site/upload',
    data: data,
    enctype: 'multipart/form-data',
    contentType: false,
    processData: false,
    method: 'POST',
    success: function(data){
      //console.log(data);
      var url = data[0].url.replace('localhost','simplenotice.site');
      console.log(url);
      $('.summernote').summernote('editor.insertImage', url);
    }
  });
}

function saveContent(title,content){
  $.ajax({
      type : 'POST',
      url : "https://api.simplenotice.site/posts",
      data : {"title":title, "content":content},
      dataType:"json",
      async: false, //동기방식
      success : function (data) {
        location.href ='https://simplenotice.site/index.html?id='+data.id;
      },
      error:function(request,status,error){
          alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      }
  });
}

function initContents(){
  var result;
  if(location.search.indexOf('?id='))
    return;

  var id = location.search.replace('?id=','');
  //ajax call();
  $.ajax({
      type : 'GET',
      url : "https://api.simplenotice.site/posts/"+id,
      dataType:"json",
      async: false, //동기방식
      success : function (data) {
        result = data;
        //console.log(result);
      },
      error:function(request,status,error){
          alert("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
      }
  });


  $(".hiddentitle").css("display","block");
  $(".title").css("display","none");

  $(".completecontent").css("display","block");
  $(".note-editor").css("display","none");

  $(".hiddentitle").text(result.title);
  $(".completecontent").html(result.content);
  initKaKao(result);
}

function initKaKao(result){

  Kakao.init('1fe9ce79f9914b2b8f4699d8c2b82844');
  // // 카카오링크 버튼을 생성합니다. 처음 한번만 호출하면 됩니다.

  Kakao.Link.createDefaultButton({
    container: '#kakao-link-btn',
    objectType: 'feed',
    content: {
      title: result.title,
      //description: result.content.substring(0,20),
      imageUrl: 'https://simplenotice.site/img/twitter_header_photo_1.png',
      link: {
        mobileWebUrl: 'https://simplenotice.site/index.html?id='+result.id,
        webUrl: 'https://simplenotice.site/index.html?id='+result.id
      }
    }/*,
    social: {
      //likeCount: 286,
      //commentCount: 45,
      //sharedCount: 845
    },
    buttons: [
      {
        title: '웹으로 보기',
        link: {
          mobileWebUrl: 'https://simplenotice.p-e.kr/index.html?'+result.id,
          webUrl: 'https://simplenotice.p-e.kr/index.html?'+result.id
        }
      },
      {
        title: '앱으로 보기',
        link: {
          mobileWebUrl: 'https://simplenotice.p-e.kr/index.html?'+result.id,
          webUrl: 'https://simplenotice.p-e.kr/index.html?'+result.id
        }
      }
    ]
    */
  });

  $('#save').css("display","none");
  $('#kakao-link-btn').css("display","inline-block");
}

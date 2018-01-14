// keeps the track of search button whether it is pressed or not
ButtonSearch();
function ButtonSearch(){
    $("#button").html(`<i class="fa fa-search" aria-hidden="true"></i>`);
    $("#button").on("click",function(){
        if($("#search").val()===""){
            return;
        }
        BeginningAnimation();
        SendRequest($("#search").val());
    })
}
function ButtonClose(){
    $("#button").html(`<i class="fa fa-close" aria-hidden="true"></i>`);
    $("#button").on("click",function(){
        $("#search-box").css("padding-top","40vh");
        $("#search").val("");
        $("#body-container").html("");
        $("#button").unbind("click");
        ButtonSearch();
    })
}

function BeginningAnimation(){
    $("#search-box").css("padding-top","8vh");
    $("#body-container").on("mouseenter",".article",function(){
        jQuery(this).children(".side-bar").css("display","block");
    })
    $("#body-container").on("mouseleave",".article",function(){
        jQuery(this).children(".side-bar").css("display","none");
    })
}
$("#search").keypress(function(e) {
    if(e.which == 13) {
        BeginningAnimation();
        SendRequest($("#search").val());
    }
});

function SendRequest(searchEntry){
    $("#button").unbind("click");
    ButtonClose();
    $.ajax({
        url: `https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&srsearch=${searchEntry}`,
        type: 'GET',
        dataType: 'jsonp',
        headers: {'Api-User-Agent': 'WikiReader/0.1.0'}
      }).done(function(data, status) {
          console.log(data);
          GenerateArticle(data);
      }).fail(function(data, status) {
        console.log("ERROR! " + status);
      });
}

function GenerateArticle(data){
    //shows all the article in a div
    var totalArticleLength = data.query.search.length;
    if(totalArticleLength==0){
        CreateErrorMessage();
    }else {
        for(var i=0;i<totalArticleLength;i++){
             (function(index){
                var title= data.query.search[index].title;
                var pageid=data.query.search[index].pageid;
                var snippet=data.query.search[index].snippet;
                //responsible for showing single data
                CreateSingleArticle(title,pageid,snippet);
                console.log(pageid);
                $(`.article:nth-child(${index+1})`).on("click",function(){
                    window.open(`https://en.wikipedia.org/?curid=${pageid}`, 'Wikipedia', 'window settings');
                })
            })(i)
        
        }
    }
}
function CreateErrorMessage(){
    var html =
    `<div class="article">
        <div class="error">
            Opps Some Error Occured
        </div>
    </div>`
    $('#body-container').html(html);
}
function CreateSingleArticle(title,pageid,snippet){

    //creates a individual data
    html =
    `<div class="article">
        <div class="side-bar"></div>
        <div class="article-container">
            <div class="article-header">
                ${title}
            </div>
            <div class="snippet">
                ${snippet}
            </div>
        </div>
    </div>`
    $("#body-container").append(html);
}
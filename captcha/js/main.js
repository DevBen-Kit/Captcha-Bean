
(function($){
    var fn;
    
    fn = {
        StartLiveCount: 3,
        WinCount: 3,
        FartCount: 3,
        Beans: [
            {
                Name: "Blackeyed Pea",
                BotanicName: "Vigna unguiculata",
                FileName: "BlackEyesPea.jpg"
            },
            {
                Name: "Chick Pea",
                BotanicName: "Cicer arietinum",
                FileName: "ChickPea.jpg"
            },
            {
                Name: "Fava Bean",
                BotanicName: "Vicia faba",
                FileName: "FavaBean.jpg"
            },
            {
                Name: "Kidney Bean",
                BotanicName: "Phaseolus vulgaris",
                FileName: "KidneyBean.jpg"
            },
            {
                Name: "Lentil",
                BotanicName: "Lens culinaris",
                FileName: "Lentil.jpg"
            },
            {
                Name: "Mung Bean",
                BotanicName: "Vigna radiata",
                FileName: "MungBean.jpg"
            },
            {
                Name: "Navy Bean",
                BotanicName: "Phaseolus vulgaris",
                FileName: "NavyBean.jpg"
            },
            {
                Name: "Pigeon Pea",
                BotanicName: "Cajanus cajan",
                FileName: "PigeonPea.jpg"
            },
            {
                Name: "Pinto Bean",
                BotanicName: "Phaseolus vulgaris",
                FileName: "PintoBean.jpg"
            },
            {
                Name: "Soy Bean",
                BotanicName: "Glycine max",
                FileName: "SoyBean.jpg"
            },
            {
                Name: "BeanBag",
                BotanicName: "Shapeless chairis",
                FileName: "BeanBag.jpg"
            },
            {
                Name: "Coffee Bean",
                BotanicName: "Coffea Arabica",
                FileName: "CoffeeBean.jpg"
            },
            {
                Name: "Jelly Bean",
                BotanicName: "Sedum rubrotinctum",
                FileName: "JellyBean.jpg"
            },
            {
                Name: "Mr. Bean",
                BotanicName: "Rowan Atkinson",
                FileName: "MrBean.jpg"
            },
        ],
        Init: function() {
            fn.Event.Reset();
        },
        Create: {
            Lives: {
                Init: function() {
                    var target = $("#div_lives").empty();
                    
                    for (var i = 0; i < fn.StartLiveCount; i++){
                        fn.Create.Lives.Item(target);
                    }
                },
                Item: function(target) {
                    var div = $("<div>").addClass("div_live");

                    div.text("❤");

                    target.append(div);
                }
            },
            Image: {
                Random: function() {
                    var target = $("#div_images").empty();
                    var imageLength = fn.Beans.length;
                    var randomIndex = fn.Data.GetRandomInt(0, imageLength - 1);

                    fn.Create.Image.Item(target, fn.Beans[randomIndex]);
                },
                Item: function(target, data) {
                    var div = $("<div>").addClass("div_image_bean");
                    var choiceList = fn.Data.GetRandomChoices(data);

                    div.css("background-image", "url('images/" + data.FileName + "')");
                    
                    fn.Create.Choice.List(choiceList, data);

                    target.append(div);
                }
            },
            Choice: {
                List: function(list, correctData) {
                    var target = $("#div_choices").empty();
                    var randomPosition = fn.Data.GetRandomInt(0, list.length - 1);

                    $.each(list, function(i, data) {
                        if (i == randomPosition) {
                            fn.Create.Choice.Item(target, correctData, true);
                        }

                        fn.Create.Choice.Item(target, data, false);
                    });
                },
                Item: function(target, data, isCorrect) {
                    var div = $("<div>").addClass("div_choice");
                    var btn = $("<button>").addClass("btn btn_choice");
                    var random = fn.Data.GetRandomInt(0, 1);
                    
                    if (random == 0)
                        btn.text(data.Name);
                    else 
                        btn.text(data.BotanicName);

                        div.on("click", function(){

                            $(".btn_choice").prop("disabled", true);

                            if (isCorrect) 
                                fn.Event.ClickCorrect();
                            else
                                fn.Event.ClickWrong();
                        });

                    div.append(btn);
                    target.append(div);
                }
            },
            Goal: {
                Init: function() {
                    var target = $("#div_goal").empty();
                },
                Item: function() {
                    var target = $("#div_goal");
                    var div = $("<div>").addClass("div_goal");

                    div.html("💩");

                    target.append(div);
                }
            },
            Flatulence: {
                Sound: function(name) {
                    var source = $("<audio>");

                    source.attr("type", "audio/mpeg");
                    source.attr("src", `audio/${name}.mp3`);
                    
                    source[0].volume = 0.5;
                    source[0].play();
                }
            }
        },
        Event: {
            Reset: function(){
                fn.Create.Lives.Init();
                fn.Create.Goal.Init();
                fn.Create.Image.Random();

                $("#span_goal_count").text(fn.WinCount);
            },
            Refresh: function(){
                fn.Create.Image.Random();
            },
            ClickCorrect: function() {
                fn.Create.Goal.Item();

                var goalCount = $(".div_goal").length;

                if (goalCount == fn.WinCount)  {
                    fn.Create.Flatulence.Sound("Win");
                    $("#span_text").hide();
                    $("#span_win").show();

                    setTimeout(function(){
                        fn.Event.Success();
                    }, 4000);
                }
                else {
                    fn.Create.Flatulence.Sound("Correct");
                    fn.Event.Refresh();
                }
            },
            ClickWrong: function() {
                $(".div_live").last().remove();

                if($(".div_live").length > 0) {
                    var randomIndex = fn.Data.GetRandomInt(1, fn.FartCount);
                    fn.Create.Flatulence.Sound(randomIndex);
                    fn.Event.Refresh();
                }
                else {
                    fn.Create.Flatulence.Sound("Lose");
                    $("#span_text").hide();
                    $("#span_fail").show();

                    setTimeout(function(){
                        $("#span_text").show();
                        $("#span_fail").hide();
                        fn.Event.Reset();
                    }, 4000);
                }
            },
            Success: function() {
                window.top.postMessage("success", '*');
            }
        },
        Data: {
            GetRandomInt: function(min, max) {
                return Math.floor(Math.random() * (max - min + 1) + min);
            },
            GetRandomChoices: function(correctData) {
                var result = [];
                var indexList = [];
                var targetLength = 3;
                
                if (fn.Beans.length > targetLength + 1) {
                    while (result.length < targetLength) {
                        var randomIndex = fn.Data.GetRandomInt(0, fn.Beans.length - 1);
                        var data = fn.Beans[randomIndex];

                        if (data.FileName != correctData.FileName && indexList.indexOf(randomIndex) == -1) {
                            indexList.push(randomIndex);
                            result.push(data);
                        }
                    }
                }

                return result;
            }
        }
    };
    
    fn.Init();
})(jQuery);

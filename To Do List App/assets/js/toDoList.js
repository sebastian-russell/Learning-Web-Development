// Check off specific to-dos by clicking
$("ul").on("click", "li", function(){
    $(this).toggleClass("completed");
});

// Remove to-do by clicking the 'X'
$("ul").on("click", "span", function(event){
    $(this).parent().fadeOut(500, function(){
        $(this).remove();
    });
    event.stopPropagation(); // prevents "bubbling up" and applying JS for parent classes
});

// Type to-do in input and hit enter to add to list
$("input[type='text']").keypress(function(event){
    if(event.which === 13){
        // extract text
        var toDoText = $(this).val();
        // make new li after last
        $("ul").append("<li><span><i class='fas fa-trash'></i> </span>" + toDoText + "</li>"); 
        // clear input so text goes away
        $(this).val("");
    }
});

// Toggle form
$("#toggle-form").click(function(){
	$("input[type='text']").fadeToggle();
});
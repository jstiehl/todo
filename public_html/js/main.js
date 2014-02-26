//Add click handler for the button

var taskItems = {};

$(function () { // on ready!

  $.getJSON("/api/data", function(data){
    taskItems = data;
    renderDetails();
  });

 	$('#submit-btn').click(function(e){
    e.preventDefault();

    var newTask = $("#exampleInputTask").val();
    if (newTask === ''){
      alert("No task was entered");
    } else {
    
    var postData = {
      Description: newTask,
      done: false
    }
    
    taskItems.tasks.push(postData);
    addTasks(postData);

    $.post("/api/data", JSON.stringify(taskItems), function(data){
      console.log("Success!");
    });
  
    $("#exampleInputTask").val('');
  }
  });
 

});

function renderDetails () {
  $table = $("#to-do-table");
  $("#sample-task").addClass("hidden");
  taskItems.tasks.forEach(function(item){
    addTasks(item);
  });
}

function addTasks(item) {   
    $row = $('<tr></tr>');
    $cell = $('<td></td>');
    $theCheck = $('<input type=\"checkbox\">');
    $deleteButton = $('<button type=\"submit\" class=\"btn btn-default\">Delete</button>');
    $table.append($row.append($cell.append($theCheck)));
    $row.append('<td>'+item.Description+'</td>');
    $row.append($('<td></td>').append($deleteButton));

    $theCheck.click(function(){
      if(!item.done){
        item.done = true;
        $(this).parent().parent().addClass("completed");
      } else {
        item.done = false;
        $(this).parent().parent().removeClass("completed");
      }
    });

    $deleteButton.click(function(){
      $(this).parent().parent().addClass("hidden");
    });
  
}
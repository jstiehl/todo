//Add click handler for the button

var taskItems = {};

$(function () { // on ready!



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
 
  init();  

});

function init() {
    $.getJSON("/api/data", function(data){
    taskItems = data;
    renderDetails();
  });
}

function renderDetails () {
  $table = $("#to-do-table");

  taskItems.tasks.forEach(function(item){
    addTasks(item);
  });
}

function addTasks(item) { 
    $("#sample-task").addClass("hidden");  
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

    // $deleteButton.click(function(){
    //   $(this).parent().parent().addClass("hidden");
    //   console.log($(this).parent().prev().text());
    // });
  
    $deleteButton.click(function(){
      $(this).parent().parent().addClass("hidden");
      var remItem = $(this).parent().prev().text();
      taskItems.tasks.forEach(function(value, index){
        console.log(value.Description);
          if(value.Description === remItem){
            taskItems.tasks.splice(index,1);
            console.log(taskItems.tasks.splice(index,1));
          }          
      });

      if (taskItems.tasks.length === 0){
          $("#sample-task").removeClass("hidden");
      }

    $.post("/api/data", JSON.stringify(taskItems), function(data){
      console.log("Success!");
    });
      console.log(taskItems);
    });

}
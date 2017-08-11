var numInputs = 2;

$("#add").on("click", function(event){
    console.log("hi");
    numInputs += 1;
    $("#inputs").append('<input type="text" id="input' + numInputs + '"' + 'name="ansChoice' + numInputs + '" placeholder="choice' + numInputs + '">');
});


$("#minus").on("click", function(event){
    if(numInputs > 2){
        var tag = "#input" + numInputs;
        console.log(tag);
        $(tag).remove();
        numInputs -= 1;
    }
});

$("form").on("submit", function(){
    $("#inputs").append("<input type='hidden' name='submitValue' value='"+
                         numInputs+"'/>");
});

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var data1 = []; 
var label1 = []; 
var backgroundColor1 = [];
Object.keys(quiz.ansChoices).forEach(function(key){ 
    data1.push(quiz.ansChoices[key].amount); 
    label1.push(quiz.ansChoices[key].value); 
    backgroundColor1.push(getRandomColor());
});

var ctx = document.getElementById("myChart").getContext('2d');
        var myChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: label1,
                datasets: [{
                    label: '# of Votes',
                    data: data1,
                    backgroundColor: backgroundColor1,
                    
                    /*[
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)'
                    ],*/
                    borderColor: backgroundColor1,
                    
                    /*[
                        'rgba(255,99,132,1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)'
                    ],*/
                    borderWidth: 1
                }]
            },
            options: {
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero:true
                        }
                    }]
                }
            }
        });
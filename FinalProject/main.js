var carArray = [];
var CarObject = function (pMake, pModel, pYear, pMPG, pMilage) {
    this.Make = pMake;
    this.Model = pModel;
    this.Year = pYear;
    this.ID = 1;
    this.MPG = pMPG;
    this.Milage = pMilage;
  }

  
// Now comes the code that must wait to run until the document is fully loaded
document.addEventListener("DOMContentLoaded", function (event) {
  
    $(document).bind("change", "#select-genre", function (event, ui) {
        selectedGenre =  document.getElementById("select-genre").value;  // <<<<<<<<<<<<<<<<<<<<<<<<<<<<<
      });

    // button events
    document.getElementById("buttonAdd").addEventListener("click", function () {
       var a =  document.getElementById("Make").value;
       var b = document.getElementById("Model").value;
       var c =  document.getElementById("Year").value; 
       var d =  document.getElementById("MPG").value; 
       var e =  document.getElementById("Milage").value;
       newCar = new CarObject(a, b, c, d, e);

       $.ajax({
        url : "/AddCar",
        type: "POST",
        data: JSON.stringify(newCar),
        contentType: "application/json; charset=utf-8",
        dataType   : "json",
        success: function (result) {
            console.log(result);
            document.location.href = "index.html#Show";  // go to this page to show item was added
        }
    });
      
    })

    document.getElementById("buttonClear").addEventListener("click", function () {
        document.getElementById("Make").value = "";
        document.getElementById("Model").value = "";
        document.getElementById("Year").value = "";
        document.getElementById("MPG").value = "";
        document.getElementById("Milage").value = "";
    })
    document.getElementById("buttonDelete").addEventListener("click", function () {
        var ID =  document.getElementById("deleteID").value;
        $.ajax({
            type: "DELETE",
            url: "/DeleteCar/" + ID ,
            success: function(result){
                console.log(result);
                document.location.href = "index.html#Show";  // go to this page to show item was deleted
            },
            error: function (xhr, textStatus, errorThrown) {  
                console.log('Error in Operation');  
                alert("Server could not delete Car with ID " + ID )
            }  
        });
    })
    $(document).on("pagebeforeshow", "#show", function (event) {   // have to use jQuery 
        UpdateDisplay();
    });

    $(document).on("pagebeforeshow", "#addDelete", function (event) {   // have to use jQuery 
        document.getElementById("Make").value = "";
        document.getElementById("Model").value = "";
        document.getElementById("Year").value = "";
        document.getElementById("MPG").value = "";
        document.getElementById("Milage").value = "";

        document.getElementById("deleteID").value = "";
    });

  
    $(document).on("pagebeforeshow", "#details", function (event) {
        setTimeout(() => {  
            let localID =  Number(document.getElementById("IDparmHere").innerHTML);
            let pointer = 0;
            let i;
            for(i=0; i < carArray.length; i++) {
                console.log(pointer + "  " + localID + "  "  + carArray[i].ID);
                if(localID == carArray[i].ID) {
                    pointer = i
                    break;
                }
            }
        
            document.getElementById("oneMake").innerHTML = "Make: " + carArray[pointer].Make;
            document.getElementById("oneModel").innerHTML = "Model: " + carArray[pointer].Model;
            document.getElementById("oneYear").innerHTML = "Year Released: " + carArray[pointer].Year;
            document.getElementById("oneMPG").innerHTML = "Average MPG: " + carArray[pointer].MPG;
            document.getElementById("oneMilage").innerHTML = "Milage: " + carArray[pointer].Milage;
        }, 100);
      });

})

function UpdateDisplay() {

    $.get("/getCars", function(data, status){
         carArray = data; 
    
    const whichElement = document.getElementById("carList")

    whichElement.innerHTML = "";
    carArray.forEach(function(item, index) {   
        var li = document.createElement("li");
        li.setAttribute("data-parm", item.ID);
        li.setAttribute("class", "carMake");
        whichElement.appendChild(li);
        li.innerHTML =li.innerHTML +  " ID: " + item.ID + "  " + item.Make 
       });    
        var cars = document.getElementsByClassName("carMake"); 
        Array.from(cars).forEach(function (element) {
            element.addEventListener('click', function(){
                var parm = this.getAttribute("data-parm");  
                document.getElementById("IDparmHere").innerHTML = parm;
                document.location.href = "index.html#details";
         });
    });  


})
}
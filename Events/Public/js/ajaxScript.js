let currentRow;

function deleteSpeaker(e, id) {
    let check = confirm("are you sure ? ")
    if (check)
        $.ajax({
            url: "http://localhost:6060/speaker/deleteSpeaker",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({
                id: id
            }),
            datatype: "text",
            success: function () {
                $(e).parents("tr").remove();
            }
        })
}

function deleteEvent(e, id) {
    let check = confirm("are you sure ? ")
    if (check)
        $.ajax({
            url: "http://localhost:6060/event/deleteEvent",
            method: "post",
            contentType: "application/json",
            data: JSON.stringify({
                id: id
            }),
            datatype: "text",
            success: function () {
                $(e).parents("tr").remove();
            }
        })
}

function getUpdateEvent(e,id) {
    currentRow = $(e);
    $.ajax({
        url: "http://localhost:6060/event/updateEvents/" + id,
        method: "get",
        datatype: "json",
        success: function (data) {
            $("#id").val(data.event._id)
            $("#title").val(data.event.title)
            $("#Date").val(moment(data.event.eventDate).utc().format('YYYY-MM-DD'))
            $("#mainSpeaker").html("");
            $("#otherSpeakers").html("");
            data.speakers.forEach(speaker => {
                let mainOption;
                let otherOption;
                if (speaker._id == data.event.mainSpeaker._id) {
                    mainOption = $(`<option value="${speaker._id}" selected> ${speaker.firstName} </option>`)
                } else {
                    mainOption = $(`<option value="${speaker._id}"> ${speaker.firstName} </option>`)
                }
                $("#mainSpeaker").append(mainOption);

                if (data.event.otherSpeakers.some(person => person._id == speaker._id)) {
                    otherOption = $(`<option value="${speaker._id}" selected> ${speaker.firstName} </option>`)
                } else {
                    otherOption = $(`<option value="${speaker._id}"> ${speaker.firstName} </option>`)
                }
                $("#otherSpeakers").append(otherOption);
            });
        }
    })
}


$("#updateEvent").submit(function (e) {
    e.preventDefault();    
    $.ajax({
        type: $(this).attr('method'),
        url: $(this).attr('action'),
        data: $(this).serialize(),
        datatype:"json",
        success: function (msg) {
            currentRow.parents("tr").find("th").text(msg._id);
            currentRow.parents("tr").find("td:eq(0)").text(msg.title);
            currentRow.parents("tr").find("td:eq(1)").text(moment(msg.eventDate).utc().format('YYYY-MM-DD'));
            currentRow.parents("tr").find("td:eq(2)").text(msg.mainSpeaker.firstName);

            let customUl = $("<ul></ul>")
            msg.otherSpeakers.forEach((speaker)=>{
                customUl.append(`<li>${speaker.firstName}</li>`)
            })
            currentRow.parents("tr").find("td:eq(3)").html(customUl);
            $('#updateFormModal').modal('toggle');
        },
        error: function () {
            //alert("failure");
        }
    });
});



function getUpdateSpeaker(e,id) {
    currentRow = $(e);
    $.ajax({
        url: "http://localhost:6060/speaker/updateSpeaker/" + id,
        method: "get",
        datatype: "json",
        success: function (speakerData) {
            $("#id").val(speakerData._id)
            $("#fName").val(speakerData.firstName)
            $("#lName").val(speakerData.lastName)
            $("#uName").val(speakerData.userName)
            $("#city").val(speakerData.Address.city)
            $("#street").val(speakerData.Address.street)
            $("#building").val(speakerData.Address.building)
        }
    })
}

$("#updateSpeaker").submit(function (e) {
    e.preventDefault();    
    $.ajax({
        type: $(this).attr('method'),
        url: $(this).attr('action'),
        data: $(this).serialize(),
        datatype:"json",
        success: function (msg) {
            //pass 
            currentRow.parents("tr").find("td:eq(0)").text(msg.firstName);
            currentRow.parents("tr").find("td:eq(1)").text(msg.Address.city);
            currentRow.parents("tr").find("td:eq(2)").text(msg.Address.street);
            currentRow.parents("tr").find("td:eq(3)").text(msg.Address.building);
            $('#updateFormModal').modal('toggle');
        },
        error: function () {
            //alert("failure");
        }
    });
});